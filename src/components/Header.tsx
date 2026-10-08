import React from 'react';
import { BookOpen, FlaskConical, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenTestLab: () => void;
  onOpenReport: () => void;
  engineMode: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenTestLab,
  onOpenReport,
  engineMode
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo 与主标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 m-0">
                LLMtoWord
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 m-0 font-medium">
              AI 对话数学公式转 Word 原生 (OMML) 中间件
            </p>
          </div>
        </div>

        {/* 状态指示与快捷操作 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 引擎状态徽章 */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>OMML 引擎: {engineMode}</span>
          </div>

          {/* 粘贴指南按钮 */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors border border-slate-200"
            title="查看 Word 粘贴操作说明"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Word 粘贴指南</span>
          </button>

          {/* 测试实验室跑分 */}
          <button
            onClick={onOpenTestLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors border border-slate-200"
            title="运行 320+ 测试用例与性能基准跑分"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">测试实验室 (320+ 用例)</span>
          </button>

          {/* 报错反馈 */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition-colors border border-slate-200"
            title="报告转换异常公式案例"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">问题反馈</span>
          </button>
        </div>
      </div>
    </header>
  );
};
