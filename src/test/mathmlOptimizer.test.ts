import { describe, it, expect } from 'vitest';
import temml from 'temml';
import { MathMLOptimizer } from '../core/converter/mathmlOptimizer';

describe('MathMLOptimizer - Word 兼容性优化测试', () => {
  it('应为 \\hat{A} 等重音符号补充 accent="true"，防止 Word 渲染为悬浮上限位', () => {
    const rawMml = temml.renderToString('\\hat{A}', { xml: true });
    expect(rawMml).not.toContain('accent="true"');

    const optimized = MathMLOptimizer.optimize(rawMml);
    expect(optimized).toContain('accent="true"');
  });

  it('应自动将 \\int 和 \\oint 后方的被积项封装入 <mrow>，消除 Word 空白虚线占位方框', () => {
    const cauchyLatex = '\\oint_{\\gamma}\\frac{f(z)}{(z-a)^{n+1}}\\,dz';
    const rawMml = temml.renderToString(cauchyLatex, { xml: true });

    const optimized = MathMLOptimizer.optimize(rawMml);
    // 应当有 msub 且后面紧跟包含被积表达式的 mrow
    expect(optimized).toContain('<msub');
    expect(optimized).toContain('<mrow>');
    // 积分算子之后应当是 mrow 包装
    expect(optimized).toMatch(/<\/msub><mrow>/);
  });

  it('应正确处理阿蒂亚-辛格指标定理公式中的 \\int_{\\cal M} 与 \\hat{A}', () => {
    const atiyahLatex = '\\mathrm{ind}(D)=\\int_{\\cal M}\\hat{A}(TM)\\wedge\\mathrm{ch}(E)';
    const rawMml = temml.renderToString(atiyahLatex, { xml: true });

    const optimized = MathMLOptimizer.optimize(rawMml);
    expect(optimized).toContain('accent="true"');
    expect(optimized).toMatch(/<\/msub><mrow>/);
  });
});
