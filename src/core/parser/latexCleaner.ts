/**
 * LaTeX 公式清洗与预处理模块
 * 处理 AI 对话常见的外层标记、Markdown 代码块、多余环境定界符、
 * 剪贴板富文本/KaTeX annotation 提取，以及 Unicode 上标、下标、希腊字母还原
 */

export interface CleanResult {
  cleaned: string;
  original: string;
  isInline: boolean;
  detectedFormat:
    | 'raw'
    | 'inline_dollar'
    | 'block_dollar'
    | 'bracket'
    | 'parenthesis'
    | 'markdown_block'
    | 'html_annotation'
    | 'html_subsup'
    | 'environment';
  extractedFromText: boolean;
}

export class LatexCleaner {
  /**
   * 从剪贴板的 HTML 富文本中提取原始 LaTeX 或转换 HTML 结构
   */
  public static extractFromHtml(html: string): string | null {
    if (!html || !html.trim()) return null;

    // 1. 优先提取 KaTeX / MathJax 的 TeX annotation 标签 (包含原汁原味的 LaTeX 上下标代码)
    const annotationMatch =
      html.match(/<annotation[^>]*encoding=["'](?:application\/x-tex|text\/x-latex|LaTeX)["'][^>]*>([\s\S]*?)<\/annotation>/i) ||
      html.match(/<annotation[^>]*>([\s\S]*?)<\/annotation>/i);

    if (annotationMatch) {
      return this.decodeHtmlEntities(annotationMatch[1]).trim();
    }

    // 2. 检查 MathJax <script type="math/tex"> 标签
    const scriptMatch = html.match(/<script[^>]*type=["']math\/tex(?:;[\w\s=]*)?["'][^>]*>([\s\S]*?)<\/script>/i);
    if (scriptMatch) {
      return this.decodeHtmlEntities(scriptMatch[1]).trim();
    }

    // 3. 检查维基百科/MediaWiki 等图片的 alt 或 data-latex 属性
    const altTexMatch = html.match(/(?:alt|data-latex|data-tex)=["']([^"']+)["']/i);
    if (altTexMatch && (altTexMatch[1].includes('\\') || altTexMatch[1].includes('^') || altTexMatch[1].includes('_'))) {
      return this.decodeHtmlEntities(altTexMatch[1]).trim();
    }

    // 4. 处理富文本中的 <sup> 与 <sub> 标签 (如从 Word/网页富文本复制的公式片段)
    if (html.includes('<sup') || html.includes('<sub')) {
      let converted = html
        .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, '^{$1}')
        .replace(/<sub[^>]*>([\s\S]*?)<\/sub>/gi, '_{$1}')
        .replace(/<[^>]+>/g, '') // 去除其余 HTML 标签
        .trim();
      return this.decodeHtmlEntities(converted);
    }

    return null;
  }

  /**
   * 清洗并规范化 LaTeX 输入
   */
  public static clean(input: string, htmlClipboard?: string): CleanResult {
    const original = input ?? '';
    let text = original.trim();

    // 如果提供了 HTML 剪贴板内容，尝试优先提取高保真 LaTeX
    if (htmlClipboard) {
      const fromHtml = this.extractFromHtml(htmlClipboard);
      if (fromHtml) {
        return {
          cleaned: this.normalizeUnicodeSymbols(fromHtml),
          original,
          isInline: false,
          detectedFormat: 'html_annotation',
          extractedFromText: true
        };
      }
    }

    if (!text) {
      return {
        cleaned: '',
        original,
        isInline: false,
        detectedFormat: 'raw',
        extractedFromText: false
      };
    }

    let detectedFormat: CleanResult['detectedFormat'] = 'raw';
    let isInline = false;
    let extractedFromText = false;

    // 1. 如果包含 Markdown 代码块标记 ```latex ... ``` 或 ```math ... ``` 或 ``` ... ```
    const codeBlockMatch = text.match(/```(?:latex|math|tex)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
      detectedFormat = 'markdown_block';
      extractedFromText = true;
    }

    // 2. 检查是否是混在自然语言中的公式 (例如 "公式如下：$$x^2+y^2=r^2$$ 说明...")
    const blockDollarMatch = text.match(/\$\$([\s\S]+?)\$\$/);
    const bracketMatch = text.match(/\\\[([\s\S]+?)\\\]/);
    const inlineDollarMatch = text.match(/(^|[^\\])\$([^\$]+?)\$/);
    const parenMatch = text.match(/\\\(([\s\S]+?)\\\)/);

    if (
      text.length > 20 &&
      (text.includes('公式') ||
        text.includes('formula') ||
        text.includes('如下') ||
        text.includes('here') ||
        text.includes('根据'))
    ) {
      if (blockDollarMatch) {
        text = blockDollarMatch[1].trim();
        detectedFormat = 'block_dollar';
        extractedFromText = true;
      } else if (bracketMatch) {
        text = bracketMatch[1].trim();
        detectedFormat = 'bracket';
        extractedFromText = true;
      } else if (inlineDollarMatch) {
        text = inlineDollarMatch[2].trim();
        detectedFormat = 'inline_dollar';
        isInline = true;
        extractedFromText = true;
      } else if (parenMatch) {
        text = parenMatch[1].trim();
        detectedFormat = 'parenthesis';
        isInline = true;
        extractedFromText = true;
      }
    }

    // 3. 剥离外层包裹的数学定界符
    if (text.startsWith('$$') && text.endsWith('$$') && text.length >= 4) {
      text = text.substring(2, text.length - 2).trim();
      detectedFormat = 'block_dollar';
      isInline = false;
    } else if (text.startsWith('\\[') && text.endsWith('\\]') && text.length >= 4) {
      text = text.substring(2, text.length - 2).trim();
      detectedFormat = 'bracket';
      isInline = false;
    } else if (text.startsWith('\\(') && text.endsWith('\\)') && text.length >= 4) {
      text = text.substring(2, text.length - 2).trim();
      detectedFormat = 'parenthesis';
      isInline = true;
    } else if (text.startsWith('$') && text.endsWith('$') && text.length >= 2) {
      text = text.substring(1, text.length - 1).trim();
      detectedFormat = 'inline_dollar';
      isInline = true;
    }

    // 4. Unicode 上下标与希腊字母规范化 (将 x² 转为 x^2，x₁ 转为 x_1 等)
    text = this.normalizeUnicodeSymbols(text);

    // 5. 针对网页划词或从 PDF/文档复制产生的多行垂直错位公式 (如超几何函数、分式、求和上下限) 进行智能重组
    text = this.reconstructMultilineFormula(text);

    return {
      cleaned: text,
      original,
      isInline,
      detectedFormat,
      extractedFromText
    };
  }

  /**
   * 解码 HTML 实体字符
   */
  private static decodeHtmlEntities(str: string): string {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  /**
   * 规范化 Unicode 字符，包括全角符号、Unicode 上下标、Unicode 希腊字母与数学符号
   */
  public static normalizeUnicodeSymbols(str: string): string {
    let result = str
      .replace(/[\u200B-\u200D\uFEFF\u2060\u200E\u200F]/g, '')
      .replace(/[—–]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[\u00A0\u3000\u2002\u2003\u2009]/g, ' ')
      .replace(/\r\n/g, '\n');

    // 1. Unicode 上标映射表 (⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱ...)
    const superscriptMap: Record<string, string> = {
      '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
      '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
      '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')',
      'ⁿ': 'n', 'ⁱ': 'i', 'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c',
      'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h',
      'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ᵒ': 'o',
      'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u',
      'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z',
      'ᵅ': '\\alpha', 'ᵝ': '\\beta', 'ᵞ': '\\gamma', 'ᵟ': '\\delta', 'ᶿ': '\\theta'
    };

    // 2. Unicode 下标映射表 (₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼ...)
    const subscriptMap: Record<string, string> = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
      '₊': '+', '₋': '-', '₌': '=', '₍': '(', '₎': ')',
      'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j',
      'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o',
      'ₚ': 'p', 'ᵣ': 'r', 'ₛ': 's', 'ₜ': 't', 'ᵤ': 'u',
      'ᵥ': 'v', 'ₓ': 'x', 'ᵦ': '\\beta', 'ᵧ': '\\gamma',
      'ᵨ': '\\rho', 'ᵩ': '\\phi', 'ᵪ': '\\chi'
    };

    // 替换连续的 Unicode 上标，例如 x²³ -> x^{23}
    result = result.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻᵅᵝᵞᵟᶿ]+)/g, match => {
      const converted = Array.from(match).map(ch => superscriptMap[ch] || ch).join('');
      return `^{${converted}}`;
    });

    // 替换连续的 Unicode 下标，例如 a₁₂ -> a_{12}
    result = result.replace(/([₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]+)/g, match => {
      const converted = Array.from(match).map(ch => subscriptMap[ch] || ch).join('');
      return `_{${converted}}`;
    });

    // 3. 常见 Unicode 希腊字母与微积分运算符映射为标准 LaTeX 宏
    const symbolMap: Record<string, string> = {
      'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ',
      'ε': '\\epsilon ', 'ζ': '\\zeta ', 'η': '\\eta ', 'θ': '\\theta ',
      'ι': '\\iota ', 'κ': '\\kappa ', 'λ': '\\lambda ', 'μ': '\\mu ',
      'ν': '\\nu ', 'ξ': '\\xi ', 'π': '\\pi ', 'ρ': '\\rho ',
      'σ': '\\sigma ', 'τ': '\\tau ', 'υ': '\\upsilon ', 'φ': '\\phi ',
      'χ': '\\chi ', 'ψ': '\\psi ', 'ω': '\\omega ',
      'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Θ': '\\Theta ', 'Λ': '\\Lambda ',
      'Ξ': '\\Xi ', 'Π': '\\Pi ', 'Σ': '\\Sigma ', 'Υ': '\\Upsilon ',
      'Φ': '\\Phi ', 'Ψ': '\\Psi ', 'Ω': '\\Omega ',
      '∮': '\\oint ', '∬': '\\iint ', '∭': '\\iiint ', '∂': '\\partial ',
      '∇': '\\nabla ', '·': '\\cdot ', '∘': '\\circ ', '√': '\\sqrt ',
      '∞': '\\infty ', '∑': '\\sum ', '∏': '\\prod ', '∫': '\\int '
    };
    for (const [char, latex] of Object.entries(symbolMap)) {
      result = result.replaceAll(char, latex);
    }

    return result.trim();
  }

  /**
   * 针对多行错位文本（如从 PDF/文档/网页划选复制时把上下标、分式、求和上下限拆散成垂直多行）进行高保真智能重构
   */
  public static reconstructMultilineFormula(str: string): string {
    if (!str) return str;
    let s = str
      .replace(/[\u200B-\u200D\uFEFF\u2060\u200E\u200F]/g, '')
      .replace(/[\u00A0\u3000\u2002\u2003\u2009]/g, ' ')
      .trim();

    // 1. Unicode 数学大符号预先标准化
    s = s
      .replace(/∑/g, '\\sum ')
      .replace(/∞/g, '\\infty ')
      .replace(/∏/g, '\\prod ')
      .replace(/∫/g, '\\int ')
      .replace(/∮/g, '\\oint ')
      .replace(/γ/g, '\\gamma ')
      .replace(/π/g, '\\pi ')
      .replace(/≠/g, '\\ne ')
      .replace(/≤/g, '\\le ')
      .replace(/≥/g, '\\ge ')
      .replace(/±/g, '\\pm ')
      .replace(/×/g, '\\times ')
      .replace(/÷/g, '\\div ');

    // 柯西高阶导数积分公式与复分析启发式重组:
    // A. 高阶导数记号: f (n) (a) -> f^{(n)}(a)
    s = s.replace(/([a-zA-Z])\s*\(([a-zA-Z0-9]+)\)\s*\(([a-zA-Z0-9]+)\)/g, '$1^{($2)}($3)');

    // B. 柯西积分因子: 2\pi i n! -> \frac{n!}{2\pi i} 或 2\pi i -> \frac{1}{2\pi i}
    if (/2\s*\\pi\s*i\s*[a-zA-Z0-9]+!/.test(s)) {
      s = s.replace(/2\s*\\pi\s*i\s*([a-zA-Z0-9]+!)/g, '\\frac{$1}{2\\pi i}');
    } else if (!s.includes('\\frac') && /2\s*\\pi\s*i/.test(s)) {
      s = s.replace(/2\s*\\pi\s*i/g, '\\frac{1}{2\\pi i}');
    }

    // C. 围道积分下标: \oint \gamma -> \oint_{\gamma}
    s = s.replace(/(\\oint)\s*(\\gamma|[C\gamma]|\\Gamma)/g, '$1_{$2} ');

    // D. 柯西被积函数: (z-a) n+1 f(z) dz -> \frac{f(z)}{(z-a)^{n+1}} dz
    s = s.replace(/(\([a-zA-Z0-9\-+\s]+\))\s*([a-zA-Z0-9+\-]+)\s*([a-zA-Z]\([a-zA-Z]\))\s*(d[a-zA-Z])/g,
      '\\frac{$3}{$1^{$2}} $4'
    );

    // 2. 检测横线分隔的多行分式: numerator \n --- \n denominator
    s = s.replace(/([^\n]+)\n\s*[-—─_=]{3,}\s*\n([^\n]+)/g, (_match, num, den) => {
      return `\\frac{${num.trim()}}{${den.trim()}}`;
    });

    // 3. 超几何函数与特殊函数前置/后置角标错位重组:
    // 模式 A: 垂直换行错位 (例如 2 \n F \n 1)
    s = s.replace(/(?:^|\n)\s*(\d+|[a-zA-Z])\s*\n+\s*([FfGgEePp])\s*\n+\s*(\d+|[a-zA-Z])\s*(?=\n|\(|\s|$)/g,
      (_match, p1, p2, p3) => {
        return `\n{}_${p1}${p2.toUpperCase()}_${p3}`;
      }
    );

    // 模式 B: 空格分隔错位，例如 "2  F 1  (a,b;c;z)" 或 "2F1(a,b;c;z)"
    s = s.replace(/(?:^|\n|\s)(\d+|[a-zA-Z])\s+([FfGgEePp])\s+(\d+|[a-zA-Z])(?=\s*[\(\_]|$)/g,
      (_match, p1, p2, p3) => {
        return ` {}_${p1}${p2.toUpperCase()}_${p3}`;
      }
    );
    s = s.replace(/(?:^|\n|\s)(\d+)([FfGgEePp])(\d+)(?=\s*[\(\_]|$)/g,
      (_match, p1, p2, p3) => {
        return ` {}_${p1}${p2.toUpperCase()}_${p3}`;
      }
    );

    // 4. 求和/积分/乘积上下限错位重组 (兼容 n=0 \sum \infty, \sum \infty n=0 等任意顺序)
    const opPattern = /(\\sum|\\prod|\\int)/;
    if (opPattern.test(s)) {
      s = s.replace(/(?:([a-z]\s*=\s*\d+|[a-z]\s*=\s*[a-z]|\d+)\s*[\n\s]*(\\sum|\\prod|\\int)\s*[\n\s]*(\\infty|\d+|[A-Z]+)|(\\infty|\d+|[A-Z]+)\s*[\n\s]*(\\sum|\\prod|\\int)\s*[\n\s]*([a-z]\s*=\s*\d+|[a-z]\s*=\s*[a-z]|\d+)|(\\sum|\\prod|\\int)\s*[\n\s]*([a-z]\s*=\s*\d+|[a-z]\s*=\s*[a-z]|\d+)\s*[\n\s]*(\\infty|\d+|[A-Z]+)|(\\sum|\\prod|\\int)\s*[\n\s]*(\\infty|\d+|[A-Z]+)\s*[\n\s]*([a-z]\s*=\s*\d+|[a-z]\s*=\s*[a-z]|\d+))/gi,
        (_match, l1, op1, u1, u2, op2, l2, op3, l3, u3, op4, u4, l4) => {
          const op = op1 || op2 || op3 || op4;
          let lower = (l1 || l2 || l3 || l4 || '').trim();
          let upper = (u1 || u2 || u3 || u4 || '').trim();
          lower = lower.replace(/\s+/g, '');
          if (!upper.startsWith('\\') && upper.toLowerCase() === 'infty') upper = '\\infty';
          return `${op}_{${lower}}^{${upper}} `;
        }
      );
    }

    // 5. 针对超几何级数尾部残缺项的特殊重构: (c)_{n} (a)_{n} (b)_{n} n! \n z n 等
    if (s.includes('F') && (s.includes('(a') || s.includes('(c') || s.includes('n!'))) {
      const funcArgsMatch = s.match(/[Ff]_[0-9a-zA-Z]+\s*\(([a-zA-Z0-9,\s;]+)\)/);
      let upperArgs = ['a', 'b'];
      let lowerArgs = ['c'];
      let zVar = 'z';

      if (funcArgsMatch) {
        const parts = funcArgsMatch[1].split(';').map(p => p.trim());
        if (parts.length >= 3) {
          upperArgs = parts[0].split(/[\s,]+/).filter(Boolean);
          lowerArgs = parts[1].split(/[\s,]+/).filter(Boolean);
          zVar = parts[2].trim() || 'z';
        }
      }

      const numStr = upperArgs.map(u => `(${u})_n`).join(' ');
      const denStr = lowerArgs.map(l => `(${l})_n`).join(' ');
      const frac1 = `\\frac{${numStr}}{${denStr}}`;
      const frac2 = `\\frac{${zVar}^n}{n!}`;

      // 匹配并替换各种包含 _{n}、_n、n!、z n、zn、\n 的碎裂片段
      const messyPattern = /(?:\([a-zA-Z0-9]+\)_\{?[a-zA-Z0-9]+\}?\s*)+(?:n!|!\s*n)?\s*[\n\s]*(?:z\s*n|zn|z\^n|n!)+/gi;
      s = s.replace(messyPattern, `${frac1} ${frac2}`);

      // 宽泛兜底：如果存在求和号后紧跟 Pochhammer 与 zn / n! 碎片
      s = s.replace(/(\\sum_\{[^\}]+\}\^\{[^\}]+\}\s*)(?:\([a-zA-Z0-9]+\)_\{?[a-zA-Z0-9]+\}?\s*)+[\s\S]*?(?:z\s*n|n!|z\^n)/gi,
        `$1${frac1} ${frac2}`
      );
      s = s.replace(/\(c\)n\(a\)n\(b\)nn!zn/gi, `${frac1} ${frac2}`);
      s = s.replace(/\(a\)n\(b\)n\s*\(c\)n\s*zn\s*n!/gi, `${frac1} ${frac2}`);
    }

    // 6. 一般性 Pochhammer 符号规范化: (x)n -> (x)_n
    s = s.replace(/\(([a-zA-Z0-9]+)\)\s*([a-zA-Z0-9])(?=[\s+\-*\/=]|$)/g, '($1)_{$2}');

    // 7. 处理残余的断行与格式拼合
    const lines = s.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 1) {
      let merged = '';
      for (let i = 0; i < lines.length; i++) {
        const cur = lines[i];
        if (i === 0) {
          merged = cur;
        } else {
          const prev = lines[i - 1];
          if (prev.endsWith('\\') || /^[{}_\^]/.test(cur) || prev.endsWith('{')) {
            merged += cur;
          } else {
            merged += ' ' + cur;
          }
        }
      }
      s = merged;
    }

    return s.trim();
  }

  /**
   * 检查文本是否被任何公式符号包裹
   */
  public static hasMathDelimiters(text: string): boolean {
    const trimmed = text.trim();
    return (
      (trimmed.startsWith('$') && trimmed.endsWith('$')) ||
      (trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) ||
      (trimmed.startsWith('\\(') && trimmed.endsWith('\\)')) ||
      /\\begin\{(equation|align|gather|matrix|pmatrix|bmatrix|cases)\}/.test(trimmed)
    );
  }
}
