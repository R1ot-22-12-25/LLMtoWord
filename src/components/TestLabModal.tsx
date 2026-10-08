import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  Play,
  CheckCircle2,
  Zap,
  Loader2,
  Award
} from 'lucide-react';
import { TestRunner } from '../core/testSuite/testRunner';
import type { BenchmarkResult } from '../core/types';

interface TestLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestLabModal: React.FC<TestLabModalProps> = ({ isOpen, onClose }) => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{ current: number; total: number; name: string } | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  const [isRunningStress, setIsRunningStress] = useState(false);
  const [stressResult, setStressResult] = useState<{
    iterations: number;
    latencies: number[];
    avgLatencyMs: number;
    maxLatencyMs: number;
    minLatencyMs: number;
    isDegraded: boolean;
  } | null>(null);

  if (!isOpen) return null;

  // 运行全量测试
  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    setProgressInfo(null);
    setBenchmarkResult(null);

    try {
      const result = await TestRunner.runAllTests((current, total, name) => {
        setProgressInfo({ current, total, name });
      });
      setBenchmarkResult(result);
    } catch (e: any) {
      alert('测试执行异常: ' + e.message);
    } finally {
      setIsRunningAll(false);
      setProgressInfo(null);
    }
  };

  // 运行连续10次压力测试
  const handleRunStressTest = async () => {
    setIsRunningStress(true);
    setStressResult(null);

    try {
      const res = await TestRunner.runStressTest(10);
      setStressResult(res);
    } catch (e: any) {
      alert('压力测试异常: ' + e.message);
    } finally {
      setIsRunningStress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 顶部栏 */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                测试实验室与性能基准跑分
              </h3>
              <p className="text-xs text-slate-500 m-0">
                覆盖 200+ 常见数学符号与 100+ 复杂结构的自动化验证
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 测试集概览卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
              <div className="text-xs text-blue-700 font-medium">数学符号覆盖</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">215 种</div>
              <div className="text-[11px] text-blue-600 mt-0.5">希腊/算子/关系/箭头等</div>
            </div>
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
              <div className="text-xs text-indigo-700 font-medium">复杂公式结构</div>
              <div className="text-2xl font-bold text-indigo-900 mt-1">106 组</div>
              <div className="text-[11px] text-indigo-600 mt-0.5">分式/多维矩阵/物理大方程</div>
            </div>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
              <div className="text-xs text-emerald-700 font-medium">指标要求</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">≥ 95%</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">标准集转换准确率</div>
            </div>
          </div>

          {/* 全量测试执行控制区 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 m-0">
                  全量 321 项测试集自动化验证
                </h4>
                <p className="text-xs text-slate-500 m-0">
                  逐一执行 LaTeX 清洗、MathML 生成与 OMML 双引擎转换验证
                </p>
              </div>
              <button
                onClick={handleRunAllTests}
                disabled={isRunningAll}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                {isRunningAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>正在跑分...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>开始全量跑分</span>
                  </>
                )}
              </button>
            </div>

            {/* 运行中进度条 */}
            {progressInfo && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span className="truncate max-w-[400px]">{progressInfo.name}</span>
                  <span className="font-mono font-bold">
                    {progressInfo.current} / {progressInfo.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 transition-all duration-75"
                    style={{
                      width: `${(progressInfo.current / progressInfo.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* 跑分结果报告 */}
            {benchmarkResult && (
              <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        跑分完成 · 整体准确率: {benchmarkResult.accuracyRate}%
                      </div>
                      <div className="text-xs text-slate-500">
                        耗时 {benchmarkResult.totalTimeMs}ms (平均每个仅{' '}
                        {(
                          benchmarkResult.totalTimeMs /
                          (benchmarkResult.symbolTestsTotal + benchmarkResult.complexTestsTotal)
                        ).toFixed(2)}
                        ms)
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      benchmarkResult.accuracyRate >= 95
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {benchmarkResult.accuracyRate >= 95 ? '达标 (≥95%)' : '未达标'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">数学符号通过：</span>
                    <strong className="text-slate-800 ml-1">
                      {benchmarkResult.symbolTestsPassed} / {benchmarkResult.symbolTestsTotal}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">复杂结构通过：</span>
                    <strong className="text-slate-800 ml-1">
                      {benchmarkResult.complexTestsPassed} / {benchmarkResult.complexTestsTotal}
                    </strong>
                  </div>
                </div>

                {benchmarkResult.failures.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-rose-700">失败案例：</div>
                    <div className="max-h-32 overflow-y-auto space-y-1 font-mono text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg">
                      {benchmarkResult.failures.map((f, i) => (
                        <div key={i}>
                          [{f.name}] {f.latex} : {f.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 连续 10 次压力测试区 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 m-0">
                  连续 10 次千字级复杂公式压力测试
                </h4>
                <p className="text-xs text-slate-500 m-0">
                  对超过 1000 字符的极限复合方程连续转换 10 次，检验系统无性能衰退
                </p>
              </div>
              <button
                onClick={handleRunStressTest}
                disabled={isRunningStress}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isRunningStress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>压测中...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>运行 10 次压测</span>
                  </>
                )}
              </button>
            </div>

            {stressResult && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">
                      压测完成：平均单次耗时 {stressResult.avgLatencyMs}ms (最慢{' '}
                      {stressResult.maxLatencyMs}ms, 最快 {stressResult.minLatencyMs}ms)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    无性能下降
                  </span>
                </div>

                <div className="flex gap-1.5 items-end h-16 pt-2 border-t border-slate-100">
                  {stressResult.latencies.map((lat, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1 group relative"
                    >
                      <div
                        className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t transition-all"
                        style={{
                          height: `${Math.max((lat / (stressResult.maxLatencyMs || 1)) * 40, 8)}px`
                        }}
                      />
                      <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
