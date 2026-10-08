import { describe, it, expect } from 'vitest';
import { TestRunner } from '../core/testSuite/testRunner';

describe('全量测试套件准确率与连续压测评估', () => {
  it('标准测试集 (215 符号 + 106 复杂结构) 转换准确率应达到 ≥ 95%', async () => {
    const result = await TestRunner.runAllTests();

    console.log(`[Benchmark] 符号通过: ${result.symbolTestsPassed}/${result.symbolTestsTotal}`);
    console.log(`[Benchmark] 结构通过: ${result.complexTestsPassed}/${result.complexTestsTotal}`);
    console.log(`[Benchmark] 准确率: ${result.accuracyRate}% (要求: >=95%)`);
    console.log(`[Benchmark] 总耗时: ${result.totalTimeMs}ms`);

    expect(result.accuracyRate).toBeGreaterThanOrEqual(95);
  }, 30000); // 允许长超时

  it('连续 10 次复杂公式压力测试无明显性能衰退', async () => {
    const stress = await TestRunner.runStressTest(10);

    console.log(`[Stress] 平均耗时: ${stress.avgLatencyMs}ms`);
    console.log(`[Stress] 各次耗时: ${stress.latencies.join(', ')}ms`);
    console.log(`[Stress] 性能衰退检测: ${stress.isDegraded ? '衰退' : '正常'}`);

    expect(stress.isDegraded).toBe(false);
    expect(stress.avgLatencyMs).toBeLessThan(100);
  });
});
