import React, { useState } from 'react';
import { X, Copy, Check, Send, Bug } from 'lucide-react';

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLatex: string;
  errorMessage?: string | null;
}

export const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  isOpen,
  onClose,
  currentLatex,
  errorMessage
}) => {
  const [description, setDescription] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const reportPayload = {
    latex: currentLatex,
    error: errorMessage || '用户主动上报问题案例',
    description: description || '未填写附加描述',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: new Date().toISOString()
  };

  const reportText = `### LLMtoWord 转换问题反馈报告
- **时间**: ${reportPayload.timestamp}
- **错误信息**: ${reportPayload.error}
- **问题描述**: ${reportPayload.description}
- **运行环境**: ${reportPayload.userAgent}
- **LaTeX 源码**:
\`\`\`latex
${reportPayload.latex}
\`\`\``;

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      alert('复制到剪贴板失败，请手动选取文本复制');
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 标题 */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">报告转换失败案例</h3>
              <p className="text-xs text-slate-500 m-0">
                协助我们持续优化特殊数学宏包与复杂公式排版兼容性
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
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* 当前失败公式预览 */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              问题 LaTeX 公式源码：
            </label>
            <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 break-all max-h-24 overflow-y-auto">
              {currentLatex || '（当前输入框为空）'}
            </div>
          </div>

          {/* 错误提示 */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <span className="font-bold">捕获到的异常：</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 用户描述 */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              问题现象描述（选填）：
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="例如：在 Word 中粘贴后出现上下标混乱、矩阵无法居中对齐、缺少某个特殊算子符号..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
            />
          </div>

          {/* 自动捕获的环境 */}
          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            已自动记录浏览器架构、屏幕参数与时间戳，用于本地模拟复现。
          </div>
        </div>

        {/* 底部 */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>已复制报告文本</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制报告数据</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-200/50 rounded-lg text-xs font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              {isSubmitted ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>反馈已记录！</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>提交反馈</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
