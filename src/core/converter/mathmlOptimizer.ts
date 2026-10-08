/**
 * MathML 针对 Microsoft Word 兼容性优化器
 * 
 * 核心解决两大痛点:
 * 1. 修复重音符号 (\hat{}, \tilde{}, \bar{} 等):
 *    Temml 渲染重音符号默认为未标记 accent 属性的 <mover>，Word 默认当做悬浮上下标 (<m:limUpp>) 处理导致位移。
 *    补全 accent="true" 让 Word 正确渲染为原生贴合重音 (<m:acc>)。
 * 
 * 2. 修复积分/环路积分/大算子 (∫, ∮ 等) 粘贴到 Word 出现虚线空白方框占位符 (□ / <m:e/>) 的问题:
 *    Word MML2OMML 转换器将积分视作 N-ary 大算子，若后方没有 <mrow> 封装的被积表达式，
 *    Word 会判定其为无参数大算子并插入空白占位符 <m:e/>。
 *    将紧随其后的被积项自动包装入 <mrow>，被积函数即自然进入积分主体，虚线方框彻底消失。
 */

export class MathMLOptimizer {
  public static optimize(mathmlStr: string): string {
    if (!mathmlStr || !mathmlStr.includes('<math')) {
      return mathmlStr;
    }

    try {
      if (typeof DOMParser === 'undefined') {
        return mathmlStr;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(mathmlStr, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return mathmlStr;
      }

      // 1. 优化重音符号: 给包含重音字符的 <mover> 注入 accent="true"
      const accentChars = new Set([
        '^', 'ˆ', '¯', '~', '˜', '˙', '¨', '⃗', '→', '˘', 'ˇ', '´', 'ˋ',
        '\u02C6', '\u0302', '\u0300', '\u0301', '\u0303', '\u0304', '\u0305', '\u0307', '\u0308', '\u20D7'
      ]);

      const movers = Array.from(doc.querySelectorAll('mover'));
      for (const mover of movers) {
        const children = Array.from(mover.children);
        if (children.length >= 2) {
          const op = children[1];
          const txt = (op.textContent || '').trim();
          const cls = op.getAttribute('class') || '';
          if (accentChars.has(txt) || cls.includes('acc') || cls.includes('hat') || cls.includes('tilde')) {
            mover.setAttribute('accent', 'true');
          }
        }
      }

      // 2. 优化积分与大算子 (N-ary Operators): 将被积函数封装进 <mrow>
      const naryChars = new Set(['∫', '∬', '∭', '∮', '∯', '∰', '∱', '∲', '∳']);
      const relChars = new Set(['=', '<', '>', '≤', '≥', '≠', '≈', '≡', '∼', '≃', '∈', '∉', '⊂', '⊆']);

      const naryCandidates = Array.from(
        doc.querySelectorAll('msub, msup, msubsup, munder, mover, munderover')
      );

      for (const node of naryCandidates) {
        const firstChild = node.firstElementChild;
        if (!firstChild) continue;
        const txt = (firstChild.textContent || '').trim();
        if (!naryChars.has(txt)) continue;

        // 确认该节点是积分算子
        const parent = node.parentElement;
        if (!parent) continue;

        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(node);
        const trailing = siblings.slice(idx + 1);

        if (trailing.length === 0) continue;
        // 如果后面只有一个元素且已经是 mrow，无需重复封装
        if (trailing.length === 1 && trailing[0].tagName.toLowerCase() === 'mrow') continue;

        // 收集属于该积分区间的被积表达式节点（直到遇到等号/关系运算符或父节点末尾）
        const groupNodes: Element[] = [];
        for (const s of trailing) {
          const sTxt = (s.textContent || '').trim();
          const sTag = s.tagName.toLowerCase();
          if (sTag === 'mo' && relChars.has(sTxt)) {
            break;
          }
          groupNodes.push(s);
        }

        if (groupNodes.length > 0) {
          const mrow = doc.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow');
          node.after(mrow);
          for (const gn of groupNodes) {
            mrow.appendChild(gn);
          }
        }
      }

      const serializer = new XMLSerializer();
      return serializer.serializeToString(doc);
    } catch (e) {
      console.warn('MathML 优化异常:', e);
      return mathmlStr;
    }
  }
}
