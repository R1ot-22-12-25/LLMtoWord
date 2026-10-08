import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImportedXmlComponent } from 'docx';

/**
 * Word 文档 (.docx) 导出服务
 * 支持将转换后的 OMML 原生公式直接打包为标准 Microsoft Word 文档并下载
 */
export class DocxExporter {
  public static async exportFormulaDocx(omml: string, latex: string, filename = 'MathFormula.docx'): Promise<void> {
    // 确保 omml 带有命名空间
    let ommlXml = omml.trim();
    if (!ommlXml.includes('xmlns:m=')) {
      ommlXml = `<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">${ommlXml}</m:oMath>`;
    }

    try {
      const mathComponent = ImportedXmlComponent.fromXmlString(ommlXml);

      const doc = new Document({
        creator: 'LLMtoWord Formula Converter',
        title: '数学公式转换导出',
        description: '由 LLMtoWord 自动生成的 Word 原生数学公式',
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: 'LLMtoWord 数学公式导出文档',
                heading: HeadingLevel.HEADING_2,
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '以下为转换生成的 Microsoft Word 原生可编辑公式：',
                    color: '64748B',
                    italics: true
                  })
                ],
                spacing: { after: 240 }
              }),
              new Paragraph({
                children: [mathComponent],
                spacing: { after: 360, before: 120 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '原始 LaTeX 源码：',
                    bold: true,
                    size: 20
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: latex,
                    font: 'Consolas',
                    color: '2563EB',
                    size: 19
                  })
                ]
              })
            ]
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      this.triggerDownload(blob, filename);
    } catch (err: any) {
      console.error('生成 Word 文档失败:', err);
      throw new Error('导出 Word 文档失败: ' + (err.message || String(err)));
    }
  }

  private static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
