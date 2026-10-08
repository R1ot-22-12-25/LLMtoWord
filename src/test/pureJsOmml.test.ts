import { describe, it, expect } from 'vitest';
import { PureJsOmmlConverter } from '../core/converter/pureJsOmml';

describe('PureJsOmmlConverter 模块测试', () => {
  it('应正确将 MathML 分数转换为 OMML m:f 结构', () => {
    const mathml = '<math><mfrac><mi>a</mi><mi>b</mi></mfrac></math>';
    const omml = PureJsOmmlConverter.convert(mathml);
    expect(omml).toContain('<m:f>');
    expect(omml).toContain('<m:num>');
    expect(omml).toContain('<m:den>');
    expect(omml).toContain('<m:t>a</m:t>');
    expect(omml).toContain('<m:t>b</m:t>');
  });

  it('应正确将 MathML 根号转换为 OMML m:rad 结构', () => {
    const mathml = '<math><msqrt><mi>x</mi></msqrt></math>';
    const omml = PureJsOmmlConverter.convert(mathml);
    expect(omml).toContain('<m:rad>');
    expect(omml).toContain('<m:degHide m:val="on"/>');
    expect(omml).toContain('<m:t>x</m:t>');
  });

  it('应正确将 MathML 上标转换为 OMML m:sSup 结构', () => {
    const mathml = '<math><msup><mi>x</mi><mn>2</mn></msup></math>';
    const omml = PureJsOmmlConverter.convert(mathml);
    expect(omml).toContain('<m:sSup>');
    expect(omml).toContain('<m:sup><m:r><m:t>2</m:t></m:r></m:sup>');
  });

  it('应正确将 MathML 矩阵转换为 OMML m:m 结构', () => {
    const mathml = '<math><mtable><mtr><mtd><mi>a</mi></mtd><mtd><mi>b</mi></mtd></mtr></mtable></math>';
    const omml = PureJsOmmlConverter.convert(mathml);
    expect(omml).toContain('<m:m>');
    expect(omml).toContain('<m:mr>');
    expect(omml).toContain('<m:e>');
  });

  it('应正确转换定界符 mfenced 为 OMML m:d 结构', () => {
    const mathml = '<math><mfenced open="(" close=")"><mi>x</mi></mfenced></math>';
    const omml = PureJsOmmlConverter.convert(mathml);
    expect(omml).toContain('<m:d>');
    expect(omml).toContain('<m:begChr m:val="("/>');
    expect(omml).toContain('<m:endChr m:val=")"/>');
  });
});
