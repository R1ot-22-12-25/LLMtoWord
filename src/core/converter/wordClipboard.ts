/**
 * Microsoft Word 智能剪贴板模块
 * 采用微软 Word 官方支持的 MathML 标准转换机制 (与 Mathpix / Typora 一致)
 * Word 2016、2019、2021、Office 365 及 WPS 会自动将标准 MathML 解析为原生可编辑公式对象
 */

import { MathMLOptimizer } from './mathmlOptimizer';

export class WordClipboard {
  /**
   * 一键复制到 Word 剪贴板
   */
  public static async copyForWord(_omml: string, mathml?: string): Promise<{ success: boolean; method: string }> {
    // 优先使用标准 MathML，确保带有 xmlns 命名空间
    let targetPayload = mathml?.trim() || '';

    if (!targetPayload) {
      targetPayload = _omml.trim();
    }

    if (targetPayload.startsWith('<math')) {
      if (!targetPayload.includes('xmlns=')) {
        targetPayload = targetPayload.replace('<math', '<math xmlns="http://www.w3.org/1998/Math/MathML"');
      }
      targetPayload = MathMLOptimizer.optimize(targetPayload);
    }

    // 1. 优先使用 navigator.clipboard.writeText 写入纯净的 MathML
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(targetPayload);
        return { success: true, method: 'writeText(MathML)' };
      } catch (err) {
        console.warn('writeText 失败，尝试 fallback 方案:', err);
      }
    }

    // 2. 备用方式
    const success = await this.copyPlainText(targetPayload);
    return { success, method: 'execCommand(plain)' };
  }

  /**
   * 仅复制指定纯文本内容 (如单纯的 OMML XML、MathML 或 LaTeX)
   */
  public static async copyPlainText(text: string): Promise<boolean> {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.error('复制纯文本失败:', e);
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (e) {
      console.error('execCommand 复制失败:', e);
    }
    document.body.removeChild(textarea);
    return success;
  }

  /**
   * 生成适用于 Word 剪贴板的 HTML 包装
   */
  public static createWordHtmlWrapper(mathContent: string): string {
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<style>
<!--
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;
	font-size:12.0pt;
	font-family:"Calibri",sans-serif;}
-->
</style>
</head>
<body>
<!--StartFragment-->
${mathContent}
<!--EndFragment-->
</body>
</html>`;
  }
}
