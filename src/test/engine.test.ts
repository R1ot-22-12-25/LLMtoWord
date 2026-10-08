import { describe, it, expect } from 'vitest';
import { FormulaConverterEngine } from '../core/converter/engine';

describe('FormulaConverterEngine 端到端集成测试', () => {
  it('应成功转换一元二次方程求根公式并生成有效 OMML 与 Word HTML', async () => {
    const latex = 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}';
    const res = await FormulaConverterEngine.convert(latex);

    expect(res.success).toBe(true);
    expect(res.omml).toContain('<m:oMath');
    expect(res.wordHtml).toContain('<!--StartFragment-->');
    expect(res.wordHtml).toContain('<!--EndFragment-->');
    expect(res.durationMs).toBeLessThan(3000); // 性能指标：3秒内完成
  });

  it('应成功转换高斯积分公式', async () => {
    const latex = '\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}';
    const res = await FormulaConverterEngine.convert(latex);

    expect(res.success).toBe(true);
    expect(res.omml).toContain('<m:oMath');
    expect(res.omml).toContain('∫');
  });

  it('应成功转换 2x2 矩阵', async () => {
    const latex = '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}';
    const res = await FormulaConverterEngine.convert(latex);

    expect(res.success).toBe(true);
    expect(res.omml).toContain('<m:oMath');
  });

  it('应成功转换分段函数 cases 环境', async () => {
    const latex = 'f(x) = \\begin{cases} x^2 & x \\ge 0 \\\\ -x & x < 0 \\end{cases}';
    const res = await FormulaConverterEngine.convert(latex);

    expect(res.success).toBe(true);
    expect(res.omml).toContain('<m:oMath');
  });

  it('应成功转换超过 500 字符的复杂大公式', async () => {
    const longLatex =
      '\\Psi(x, y, z) = \\frac{\\sqrt[3]{\\int_0^1 \\frac{t^4 + 2t^2 + 1}{\\sqrt{1 - t^2}} dt} + \\sum_{k=1}^\\infty \\frac{(-1)^k}{k^2 + 1} \\cos(k x)}{\\left( \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2} + \\frac{\\partial^2 f}{\\partial z^2} \\right)^{\\frac{1}{4}} + \\sqrt{1 + \\frac{x^2}{y^2 + \\frac{z^2}{1 + x^2}}}}';
    const res = await FormulaConverterEngine.convert(longLatex);

    expect(res.success).toBe(true);
    expect(res.omml).toContain('<m:oMath');
    expect(res.durationMs).toBeLessThan(3000);
  });

  it('空输入或非法语法应返回明确的错误原因与建议', async () => {
    const res = await FormulaConverterEngine.convert('');
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.suggestion).toBeTruthy();
  });
});
