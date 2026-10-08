import React from 'react';
import { ArrowRight, Loader2, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface ConvertControlsProps {
  onConvert: () => void;
  isLoading: boolean;
  durationMs: number | null;
  error: string | null;
  suggestion?: string | null;
  autoConvert: boolean;
  onToggleAutoConvert: (enabled: boolean) => void;
  canConvert: boolean;
}

export const ConvertControls: React.FC<ConvertControlsProps> = ({
  onConvert,
  isLoading,
  durationMs,
  error,
  suggestion,
  autoConvert,
  onToggleAutoConvert,
  canConvert
}) => {
  const isTimeout = durationMs !== null && durationMs > 5000;

  return (
    <div className="flex flex-col items-center justify-center gap-3 my-2">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {/* 核心转换按钮 */}
        <button
          onClick={onConvert}
          disabled={isLoading || !canConvert}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-md ${
            isLoading || !canConvert
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>正在解析与转换...</span>
            </>
          ) : (
            <>
              <span>转换为 Word 公式</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* 自动转换开关 */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-850">
          <input
            type="checkbox"
            checked={autoConvert}
            onChange={e => onToggleAutoConvert(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            输入实时自动转换
          </span>
        </label>
      </div>

      {/* 状态与耗时指示器 */}
      <div className="flex items-center gap-3 text-xs">
        {isLoading && (
          <div className="flex items-center gap-1.5 text-blue-600 animate-pulse font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>转换中，正在生成 OMML 与 MathML...</span>
          </div>
        )}

        {!isLoading && durationMs !== null && !error && (
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>转换成功 · 耗时 {durationMs}ms (&lt;3秒)</span>
          </div>
        )}

        {isTimeout && (
          <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>转换超过 5 秒已超时，建议检查公式复杂度</span>
          </div>
        )}
      </div>

      {/* 转换错误提示与建议 */}
      {!isLoading && error && (
        <div className="w-full max-w-2xl p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 shadow-2xs">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-rose-900">转换失败：{error}</div>
              {suggestion && (
                <div className="mt-1 text-rose-700 bg-rose-100/60 p-2 rounded-lg">
                  💡 可能的解决方案：{suggestion}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
