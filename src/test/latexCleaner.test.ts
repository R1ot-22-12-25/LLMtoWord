import { describe, it, expect } from 'vitest';
import { LatexCleaner } from '../core/parser/latexCleaner';

describe('LatexCleaner 模块测试', () => {
  it('应能够剥离 Markdown 代码块标记 (```latex ... ```)', () => {
    const input = '```latex\n\\frac{a}{b}\n```';
    const res = LatexCleaner.clean(input);
    expect(res.cleaned).toBe('\\frac{a}{b}');
    expect(res.detectedFormat).toBe('markdown_block');
  });

  it('应能够剥离行间定界符 $$...$$', () => {
    const input = '$$E = mc^2$$';
    const res = LatexCleaner.clean(input);
    expect(res.cleaned).toBe('E = mc^2');
    expect(res.isInline).toBe(false);
  });

  it('应能够剥离 LaTeX 方括号定界符 \\[...\\]', () => {
    const input = '\\[\\int_0^1 x dx\\]';
    const res = LatexCleaner.clean(input);
    expect(res.cleaned).toBe('\\int_0^1 x dx');
    expect(res.isInline).toBe(false);
  });

  it('应能够剥离行内公式定界符 $...$ 与 \\(...\\)', () => {
    const inputDollar = '$a + b = c$';
    const resDollar = LatexCleaner.clean(inputDollar);
    expect(resDollar.cleaned).toBe('a + b = c');
    expect(resDollar.isInline).toBe(true);

    const inputParen = '\\(x^2 + y^2 = 1\\)';
    const resParen = LatexCleaner.clean(inputParen);
    expect(resParen.cleaned).toBe('x^2 + y^2 = 1');
    expect(resParen.isInline).toBe(true);
  });

  it('应能从 AI 对话混排文本中精准提取公式主体', () => {
    const input = '根据以上推导，该公式如下：$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$，这是方程的两个根。';
    const res = LatexCleaner.clean(input);
    expect(res.cleaned).toBe('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
    expect(res.extractedFromText).toBe(true);
  });

  it('应规范化全角空格和全角连字符等异常字符', () => {
    const input = 'a　–　b';
    const res = LatexCleaner.clean(input);
    expect(res.cleaned).toBe('a - b');
  });

  it('应能从 KaTeX 网页 HTML annotation 提取完整上下角标 LaTeX', () => {
    const katexHtml =
      '<span class="katex"><math><semantics><mrow><msubsup><mi>R</mi><mrow><mi>σ</mi><mi>μ</mi><mi>ν</mi></mrow><mi>ρ</mi></msubsup></mrow><annotation encoding="application/x-tex">R^{\\rho}_{\\sigma\\mu\\nu} = \\partial_\\mu \\Gamma^\\rho_{\\nu\\sigma}</annotation></semantics></math></span>';
    const res = LatexCleaner.extractFromHtml(katexHtml);
    expect(res).toBe('R^{\\rho}_{\\sigma\\mu\\nu} = \\partial_\\mu \\Gamma^\\rho_{\\nu\\sigma}');
  });

  it('应能将 HTML <sup> 和 <sub> 标签正确还原为 LaTeX 上下角标', () => {
    const richTextHtml = '<p>R<sup>ρ</sup><sub>σμν</sub> = ∂<sub>μ</sub>Γ<sup>ρ</sup><sub>νσ</sub></p>';
    const res = LatexCleaner.extractFromHtml(richTextHtml);
    expect(res).toBe('R^{ρ}_{σμν} = ∂_{μ}Γ^{ρ}_{νσ}');
  });

  it('应将纯文本中的 Unicode 上下标字符自动转换为 LaTeX 标准角标', () => {
    const unicodeText = 'x² + y² = r² 且 a₁ + a₂ = b₁';
    const res = LatexCleaner.normalizeUnicodeSymbols(unicodeText);
    expect(res).toBe('x^{2} + y^{2} = r^{2} 且 a_{1} + a_{2} = b_{1}');
  });

  it('应能智能重构因 PDF / 网页划选复制产生的多行垂直错位超几何函数', () => {
    const brokenInput = '2\n\n F\n1\n\n(a,b;c;z)=\nn=0\n∑\n∞\n(c)n(a)n(b)nn!zn';
    const res = LatexCleaner.clean(brokenInput);
    expect(res.cleaned).toContain('{}_2F_1');
    expect(res.cleaned).toContain('\\sum_{n=0}^{\\infty}');
    expect(res.cleaned).toContain('\\frac{(a)_n (b)_n}{(c)_n}');
    expect(res.cleaned).toContain('\\frac{z^n}{n!}');
  });

  it('应能识别横线分隔的多行分式并转换为 \\frac', () => {
    const divInput = '(a)_n (b)_n\n-----------------\n(c)_n';
    const res = LatexCleaner.clean(divInput);
    expect(res.cleaned).toBe('\\frac{(a)_n (b)_n}{(c)_n}');
  });

  it('应能规整求和上下限错位排列的公式', () => {
    const sumInput = 'n=0\n\\sum\n\\infty\n\\frac{1}{n^2}';
    const res = LatexCleaner.clean(sumInput);
    expect(res.cleaned).toBe('\\sum_{n=0}^{\\infty} \\frac{1}{n^2}');
  });

  it('应能精准修复用户截图中的超几何函数特定输入格式 (包含空格错位与分式剥离)', () => {
    const userExactInput = '2  F 1  (a,b;c;z)= \\sum_{n=0}^{\\infty}  (c)_{n}  (a)_{n}  (b)_{n}   n!\nz n';
    const res = LatexCleaner.clean(userExactInput);
    expect(res.cleaned).toContain('{}_2F_1');
    expect(res.cleaned).toContain('\\frac{(a)_n (b)_n}{(c)_n}');
    expect(res.cleaned).toContain('\\frac{z^n}{n!}');
  });

  it('应能精准修复用户截图中的柯西高阶导数积分公式 (从 PDF 复制丢失除号与角标的情况)', () => {
    const cauchyInput = 'f (n) (a)= 2πi n! ∮ γ (z-a) n+1 f(z) dz';
    const res = LatexCleaner.clean(cauchyInput);
    expect(res.cleaned).toContain('f^{(n)}(a)');
    expect(res.cleaned).toContain('\\frac{n!}{2\\pi i}');
    expect(res.cleaned).toContain('\\oint_{\\gamma}');
    expect(res.cleaned).toContain('\\frac{f(z)}{(z-a)^{n+1}}');
  });
});
