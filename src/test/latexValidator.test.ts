import { describe, it, expect } from 'vitest';
import { LatexValidator } from '../core/parser/latexValidator';

describe('LatexValidator 模块测试', () => {
  it('正确完整的公式应通过校验', () => {
    const res = LatexValidator.validate('\\frac{a+b}{c-d} + \\sqrt{x^2+y^2}');
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  it('未闭合的大括号应被检测出并提供补齐建议', () => {
    const res = LatexValidator.validate('\\frac{a+b}{c');
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0].message).toContain('未闭合');
    expect(res.errors[0].suggestion).toContain('闭合右大括号');
  });

  it('多余闭合的大括号应被检测出', () => {
    const res = LatexValidator.validate('a + b} = c');
    expect(res.valid).toBe(false);
    expect(res.errors[0].message).toContain('多余的闭合大括号');
  });

  it('未闭合的环境应被检测出 (如缺少 \\end{pmatrix})', () => {
    const res = LatexValidator.validate('\\begin{pmatrix} a & b \\\\ c & d');
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.message.includes('未闭合'))).toBe(true);
  });

  it('末尾悬空的 \\frac 命令应提示补充参数', () => {
    const res = LatexValidator.validate('y = \\frac');
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.message.includes('缺少分子与分母'))).toBe(true);
  });

  it('末尾悬空的根号 \\sqrt 应提示补充被开方数', () => {
    const res = LatexValidator.validate('y = \\sqrt');
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.message.includes('缺少被开方数'))).toBe(true);
  });
});
