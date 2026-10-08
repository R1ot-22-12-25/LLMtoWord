import temml from 'temml';
import katex from 'katex';
import type { ConversionResult } from '../types';
import { LatexCleaner } from '../parser/latexCleaner';
import { LatexValidator } from '../parser/latexValidator';
import { XsltEngine } from './xsltEngine';
import { PureJsOmmlConverter } from './pureJsOmml';
import { WordClipboard } from './wordClipboard';

/**
 * 核心公式转换引擎 (Coordinator)
 * 编排 LaTeX 清洗 -> MathML 生成 -> OMML 双引擎转换 -> Word 剪贴板包封装
 */
export class FormulaConverterEngine {
  /**
   * 执行完整的公式转换流程
   */
  public static async convert(rawInput: string): Promise<ConversionResult> {
    const startTime = performance.now();

    if (!rawInput || !rawInput.trim()) {
      return {
        success: false,
        latex: '',
        cleanLatex: '',
        mathml: '',
        omml: '',
        wordHtml: '',
        durationMs: 0,
        error: '输入内容为空，请输入有效的 LaTeX 数学公式代码',
        suggestion: '请尝试输入示例公式，如 \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
      };
    }

    try {
      // 1. 清洗与预处理 (剥离 Markdown 代码块、AI前缀、行内/行间定界符)
      const cleanResult = LatexCleaner.clean(rawInput);
      const cleanLatex = cleanResult.cleaned;

      if (!cleanLatex) {
        return {
          success: false,
          latex: rawInput,
          cleanLatex: '',
          mathml: '',
          omml: '',
          wordHtml: '',
          durationMs: Math.round(performance.now() - startTime),
          error: '未能从输入文本中解析出有效的数学公式内容',
          suggestion: '请检查是否包含了完整的公式，或直接粘贴 LaTeX 代码'
        };
      }

      // 2. 语法预校验
      const validation = LatexValidator.validate(cleanLatex);
      if (!validation.valid && validation.errors.length > 0) {
        const firstErr = validation.errors[0];
        // 括号严重不配对等致命语法直接拦截并友好提示
        if (firstErr.message.includes('未闭合') || firstErr.message.includes('多余')) {
          return {
            success: false,
            latex: rawInput,
            cleanLatex,
            mathml: '',
            omml: '',
            wordHtml: '',
            durationMs: Math.round(performance.now() - startTime),
            error: firstErr.message,
            suggestion: firstErr.suggestion
          };
        }
      }

      // 3. LaTeX 转换为 MathML
      let mathml = '';
      try {
        // 首选 Temml (生成纯净规范的 MathML 结构)
        mathml = temml.renderToString(cleanLatex, {
          displayMode: !cleanResult.isInline,
          annotate: false
        });
      } catch (temmlErr: any) {
        console.warn('Temml 转换失败，尝试 KaTeX 备用解析:', temmlErr);
        // 备选方案：KaTeX MathML 输出
        try {
          const katexHtml = katex.renderToString(cleanLatex, {
            displayMode: !cleanResult.isInline,
            output: 'mathml',
            throwOnError: true
          });
          const match = katexHtml.match(/<math[\s\S]*?<\/math>/i);
          if (match) {
            mathml = match[0];
          } else {
            throw new Error('KaTeX MathML 提取失败');
          }
        } catch (katexErr: any) {
          return {
            success: false,
            latex: rawInput,
            cleanLatex,
            mathml: '',
            omml: '',
            wordHtml: '',
            durationMs: Math.round(performance.now() - startTime),
            error: `LaTeX 语法解析失败: ${temmlErr.message || katexErr.message}`,
            suggestion: this.analyzeErrorSuggestion(temmlErr.message || katexErr.message)
          };
        }
      }

      // 确保 MathML 包含标准 xmlns
      if (!mathml.includes('xmlns="http://www.w3.org/1998/Math/MathML"')) {
        mathml = mathml.replace(/<math([^>]*)>/, '<math xmlns="http://www.w3.org/1998/Math/MathML"$1>');
      }

      // 4. MathML 转换为 OMML (双引擎架构)
      let omml = '';

      if (XsltEngine.isSupported()) {
        try {
          omml = XsltEngine.transform(mathml);
        } catch (xsltErr: any) {
          console.warn('XSLT 转换遇到异常，启动纯 JS 备用引擎:', xsltErr);
          omml = PureJsOmmlConverter.convert(mathml);
        }
      } else {
        omml = PureJsOmmlConverter.convert(mathml);
      }

      // 确保 OMML 根标签与命名空间完整性
      if (!omml.includes('<m:oMath')) {
        omml = `<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">${omml}</m:oMath>`;
      }

      // 5. 生成 Word HTML 剪贴板封装格式
      const wordHtml = WordClipboard.createWordHtmlWrapper(omml);

      const durationMs = Math.round(performance.now() - startTime);

      return {
        success: true,
        latex: rawInput,
        cleanLatex,
        mathml,
        omml,
        wordHtml,
        durationMs
      };
    } catch (globalErr: any) {
      console.error('转换引擎未知异常:', globalErr);
      return {
        success: false,
        latex: rawInput,
        cleanLatex: '',
        mathml: '',
        omml: '',
        wordHtml: '',
        durationMs: Math.round(performance.now() - startTime),
        error: `未知错误: ${globalErr.message || String(globalErr)}`,
        suggestion: '请尝试检查公式中是否包含不支持的特殊宏包或非数学字符'
      };
    }
  }

  /**
   * 根据错误日志给出可能的解决方案建议
   */
  private static analyzeErrorSuggestion(errorMsg: string): string {
    const lower = errorMsg.toLowerCase();
    if (lower.includes('unexpected end') || lower.includes('expected')) {
      return '公式可能未输入完整，请检查是否有遗漏的闭合括号 } 或 \\end{...}';
    }
    if (lower.includes('unknown symbol') || lower.includes('undefined control sequence')) {
      return '可能包含未定义的 LaTeX 命令或宏包专有命令，请替换为标准数学命令';
    }
    if (lower.includes('double exponent') || lower.includes('double subscript')) {
      return '检测到连续的双重上下标，建议使用花括号明确层级，例如 x^{a^b} 或 a_{i_{j}}';
    }
    return '请检查公式语法是否符合标准 LaTeX 数学模式规范';
  }
}
