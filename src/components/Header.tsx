import React from 'react';
import { BookOpen, FlaskConical, AlertTriangle, Sparkles, CheckCircle2, Star } from 'lucide-react';

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
            title="报告转换异常公式案例 (支持邮箱直达与 GitHub Issue)"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">问题反馈</span>
          </button>

          {/* GitHub 仓库跳转与 Star 按钮 */}
          <a
            href="https://github.com/zjq-22-12-25/LLMtoWord"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 transition-all border border-slate-300 shadow-2xs group"
            title="前往 GitHub 仓库查看开源源码，欢迎点亮 Star 支持！"
          >
            <svg
              className="w-4 h-4 text-slate-800 group-hover:text-black transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-300 text-[11px] group-hover:bg-amber-100 transition-colors">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>Star</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};
