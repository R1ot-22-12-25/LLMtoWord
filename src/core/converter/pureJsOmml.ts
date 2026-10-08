/**
 * 纯 TypeScript 实现的 MathML 到 OMML (Office Math Markup Language) 备用转换引擎
 * 具有零外部依赖、高容错、跨平台（浏览器/Node/Web Worker）等特性
 */

export class PureJsOmmlConverter {
  /**
   * 将 MathML 字符串转换为 OMML XML 字符串
   */
  public static convert(mathml: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(mathml, 'text/xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('MathML 解析失败: ' + parserError.textContent);
    }

    const mathEl = doc.querySelector('math') || doc.documentElement;
    const innerContent = this.convertNodes(Array.from(mathEl.childNodes));

    return `<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">${innerContent}</m:oMath>`;
  }

  private static convertNodes(nodes: ChildNode[]): string {
    return nodes.map(node => this.convertNode(node)).join('');
  }

  private static convertNode(node: ChildNode): string {
    if (node.nodeType === 3) { // 文本节点
      const text = node.textContent?.trim();
      return text ? `<m:r><m:t>${this.escapeXml(text)}</m:t></m:r>` : '';
    }

    if (node.nodeType !== 1) { // 非元素节点
      return '';
    }

    const el = node as Element;
    const tagName = el.localName?.toLowerCase() || el.tagName.toLowerCase();
    const children = Array.from(el.childNodes);

    switch (tagName) {
      case 'math':
      case 'semantics':
      case 'annotation':
      case 'annotation-xml':
        if (tagName === 'annotation' || tagName === 'annotation-xml') {
          return ''; // 忽略 TeX 注解标签
        }
        return this.convertNodes(children);

      case 'mrow':
      case 'mstyle':
      case 'mpadded':
      case 'mphantom':
        return this.convertNodes(children);

      case 'mfrac': {
        const numNode = children[0];
        const denNode = children[1];
        const numXml = numNode ? this.convertNode(numNode) : '<m:r><m:t></m:t></m:r>';
        const denXml = denNode ? this.convertNode(denNode) : '<m:r><m:t></m:t></m:r>';
        return `<m:f><m:fPr><m:type m:val="bar"/></m:fPr><m:num>${numXml}</m:num><m:den>${denXml}</m:den></m:f>`;
      }

      case 'msqrt': {
        const baseXml = this.convertNodes(children);
        return `<m:rad><m:radPr><m:degHide m:val="on"/></m:radPr><m:deg/><m:e>${baseXml}</m:e></m:rad>`;
      }

      case 'mroot': {
        const baseNode = children[0];
        const degNode = children[1];
        const baseXml = baseNode ? this.convertNode(baseNode) : '';
        const degXml = degNode ? this.convertNode(degNode) : '';
        return `<m:rad><m:radPr><m:degHide m:val="off"/></m:radPr><m:deg>${degXml}</m:deg><m:e>${baseXml}</m:e></m:rad>`;
      }

      case 'msup': {
        const base = children[0] ? this.convertNode(children[0]) : '';
        const sup = children[1] ? this.convertNode(children[1]) : '';
        return `<m:sSup><m:e>${base}</m:e><m:sup>${sup}</m:sup></m:sSup>`;
      }

      case 'msub': {
        const base = children[0] ? this.convertNode(children[0]) : '';
        const sub = children[1] ? this.convertNode(children[1]) : '';
        return `<m:sSub><m:e>${base}</m:e><m:sub>${sub}</m:sub></m:sSub>`;
      }

      case 'msubsup': {
        const base = children[0] ? this.convertNode(children[0]) : '';
        const sub = children[1] ? this.convertNode(children[1]) : '';
        const sup = children[2] ? this.convertNode(children[2]) : '';
        return `<m:sSubSup><m:e>${base}</m:e><m:sub>${sub}</m:sub><m:sup>${sup}</m:sup></m:sSubSup>`;
      }

      case 'munderover':
      case 'mover':
      case 'munder': {
        // 求和、积分等大型运算符
        const op = children[0] ? this.convertNode(children[0]) : '';
        const sub = children[1] ? this.convertNode(children[1]) : '';
        const sup = children[2] ? this.convertNode(children[2]) : '';
        
        // 提取操作符字符
        const chrMatch = op.match(/<m:t>(.*?)<\/m:t>/);
        const chr = chrMatch ? chrMatch[1] : '∑';

        if (tagName === 'mover') {
          return `<m:limUpp><m:e>${op}</m:e><m:lim>${sub}</m:lim></m:limUpp>`;
        } else if (tagName === 'munder') {
          return `<m:limLow><m:e>${op}</m:e><m:lim>${sub}</m:lim></m:limLow>`;
        }

        return `<m:nary><m:naryPr><m:chr m:val="${this.escapeXml(chr)}"/><m:limLoc m:val="subSup"/><m:grow m:val="1"/></m:naryPr><m:sub>${sub}</m:sub><m:sup>${sup}</m:sup><m:e></m:e></m:nary>`;
      }

      case 'mfenced': {
        const open = el.getAttribute('open') || '(';
        const close = el.getAttribute('close') || ')';
        const inner = this.convertNodes(children);
        return `<m:d><m:dPr><m:begChr m:val="${this.escapeXml(open)}"/><m:endChr m:val="${this.escapeXml(close)}"/></m:dPr><m:e>${inner}</m:e></m:d>`;
      }

      case 'mtable': {
        const rows = children
          .filter(c => c.nodeType === 1 && (c as Element).localName === 'mtr')
          .map(rowNode => {
            const cells = Array.from(rowNode.childNodes)
              .filter(c => c.nodeType === 1 && (c as Element).localName === 'mtd')
              .map(cellNode => `<m:e>${this.convertNodes(Array.from(cellNode.childNodes))}</m:e>`)
              .join('');
            return `<m:mr>${cells}</m:mr>`;
          })
          .join('');
        return `<m:m><m:mPr><m:baseJc m:val="center"/><m:plcHide m:val="1"/></m:mPr>${rows}</m:m>`;
      }

      case 'mi':
      case 'mo':
      case 'mn':
      case 'mtext': {
        const text = el.textContent || '';
        return `<m:r><m:t>${this.escapeXml(text)}</m:t></m:r>`;
      }

      case 'mspace': {
        return `<m:r><m:t> </m:t></m:r>`;
      }

      default:
        return this.convertNodes(children);
    }
  }

  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
