import type { BenchmarkResult } from '../types';
import { FormulaConverterEngine } from '../converter/engine';
import { MATH_SYMBOLS_TEST_CASES } from './mathSymbols';
import { COMPLEX_FORMULAS_TEST_CASES } from './complexFormulas';

export interface ProgressCallback {
  (current: number, total: number, currentItemName: string): void;
}

/**
 * 自动化测试与基准性能评估运行器
 */
export class TestRunner {
  /**
   * 运行全部测试集 (包含 215 常见符号与 106 复杂公式结构，合计 321 个测试用例)
   */
  public static async runAllTests(onProgress?: ProgressCallback): Promise<BenchmarkResult> {
    const startTime = performance.now();
    const failures: BenchmarkResult['failures'] = [];

    let symbolPassed = 0;
    let complexPassed = 0;

    const totalTests = MATH_SYMBOLS_TEST_CASES.length + COMPLEX_FORMULAS_TEST_CASES.length;
    let currentStep = 0;

    // 1. 运行符号测试集
    for (const item of MATH_SYMBOLS_TEST_CASES) {
      currentStep++;
      if (onProgress) {
        onProgress(currentStep, totalTests, `测试符号: ${item.name} (${item.latex})`);
      }

      try {
        const res = await FormulaConverterEngine.convert(item.latex);
        if (res.success && res.omml && res.omml.includes('<m:oMath')) {
          symbolPassed++;
        } else {
          failures.push({
            name: `符号: ${item.name}`,
            latex: item.latex,
            reason: res.error || 'OMML 输出结构不完整'
          });
        }
      } catch (err: any) {
        failures.push({
          name: `符号: ${item.name}`,
          latex: item.latex,
          reason: err.message || String(err)
        });
      }
    }

    // 2. 运行复杂结构测试集
    for (const item of COMPLEX_FORMULAS_TEST_CASES) {
      currentStep++;
      if (onProgress) {
        onProgress(currentStep, totalTests, `测试结构: ${item.name}`);
      }

      try {
        const res = await FormulaConverterEngine.convert(item.latex);
        if (res.success && res.omml && res.omml.includes('<m:oMath')) {
          complexPassed++;
        } else {
          failures.push({
            name: `复杂结构: ${item.name}`,
            latex: item.latex,
            reason: res.error || 'OMML 输出结构不完整'
          });
        }
      } catch (err: any) {
        failures.push({
          name: `复杂结构: ${item.name}`,
          latex: item.latex,
          reason: err.message || String(err)
        });
      }
    }

    const totalPassed = symbolPassed + complexPassed;
    const totalTimeMs = Math.round(performance.now() - startTime);
    const accuracyRate = Number(((totalPassed / totalTests) * 100).toFixed(2));

    return {
      symbolTestsTotal: MATH_SYMBOLS_TEST_CASES.length,
      symbolTestsPassed: symbolPassed,
      complexTestsTotal: COMPLEX_FORMULAS_TEST_CASES.length,
      complexTestsPassed: complexPassed,
      totalTimeMs,
      accuracyRate,
      failures
    };
  }

  /**
   * 运行连续 10 次复杂公式压力测试，评估系统是否存在性能衰退
   */
  public static async runStressTest(iterations = 10): Promise<{
    iterations: number;
    latencies: number[];
    avgLatencyMs: number;
    maxLatencyMs: number;
    minLatencyMs: number;
    isDegraded: boolean;
  }> {
    // 选取最复杂的千字级超级矩阵公式进行连续压测
    const complexLatex = COMPLEX_FORMULAS_TEST_CASES.find(c => c.id === 'comp-105')!.latex;
    const latencies: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const res = await FormulaConverterEngine.convert(complexLatex);
      const cost = Math.round(performance.now() - start);
      if (!res.success) {
        throw new Error(`压力测试第 ${i + 1} 次转换失败: ${res.error}`);
      }
      latencies.push(cost);
    }

    const avgLatencyMs = Number((latencies.reduce((a, b) => a + b, 0) / iterations).toFixed(2));
    const maxLatencyMs = Math.max(...latencies);
    const minLatencyMs = Math.min(...latencies);

    // 如果后半程平均耗时相比前半程增长未超过 50%，判定为无性能衰退
    const firstHalfAvg = latencies.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const secondHalfAvg = latencies.slice(5).reduce((a, b) => a + b, 0) / 5;
    const isDegraded = secondHalfAvg > firstHalfAvg * 1.5 && secondHalfAvg - firstHalfAvg > 50;

    return {
      iterations,
      latencies,
      avgLatencyMs,
      maxLatencyMs,
      minLatencyMs,
      isDegraded
    };
  }
}
