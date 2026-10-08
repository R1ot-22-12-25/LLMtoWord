import React, { useState } from 'react';
import { X, Copy, Check, Mail, Bug, ExternalLink } from 'lucide-react';

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
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  if (!isOpen) return null;

  const DEVELOPER_EMAIL = 'zhangjiaqi@stu.sau.edu.cn';
  const GITHUB_REPO_URL = 'https://github.com/zjq-22-12-25/LLMtoWord';

  const reportPayload = {
    latex: currentLatex || '（未输入公式）',
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

  // 1. 复制报告全文
  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      alert('复制到剪贴板失败，请手动选取文本复制');
    }
  };

  // 2. 复制开发者邮箱
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_EMAIL);
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2500);
    } catch {
      alert('复制邮箱失败');
    }
  };

  // 3. 唤起本地邮件客户端
  const handleSendMail = () => {
    const subject = encodeURIComponent(`[LLMtoWord反馈] 公式转换异常案例`);
    const body = encodeURIComponent(
      `你好，开发者！\n\n我在使用 LLMtoWord 时遇到了公式排版或转换问题，以下是诊断报告信息：\n\n${reportText}\n\n期待您的修复与更新！`
    );
    window.open(`mailto:${DEVELOPER_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  // 4. 打开 GitHub Issues
  const handleOpenGitHubIssue = () => {
    const issueTitle = encodeURIComponent(`[Bug 反馈] 公式转换异常案例`);
    const issueBody = encodeURIComponent(reportText);
    window.open(`${GITHUB_REPO_URL}/issues/new?title=${issueTitle}&body=${issueBody}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 标题 */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">问题反馈与案例上报</h3>
              <p className="text-xs text-slate-500 m-0">
                可直达开发者个人邮箱或提交 GitHub Issue，协助持续改进
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
          {/* 开发者邮箱直接联系卡片 */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-950 text-xs">开发者联系邮箱</div>
                <div className="font-mono text-[11px] text-blue-700">{DEVELOPER_EMAIL}</div>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100/50 transition-colors flex items-center gap-1 shrink-0"
            >
              {isEmailCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>复制邮箱</span>
                </>
              )}
            </button>
          </div>

          {/* 当前失败公式预览 */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              当前问题公式代码：
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
              placeholder="例如：在 Word 中粘贴后出现上下标错位、缺少某个特定积分算子、或者某类公式被解析报错..."
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
            />
          </div>

          {/* 自动捕获的环境 */}
          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            点击下方邮件直达或 GitHub 提交，系统已为你自动整理好环境参数与测试代码。
          </div>
        </div>

        {/* 底部按钮区域 */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* 复制报告 */}
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>已复制数据</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制诊断报告</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* 邮件直达反馈 */}
            <button
              onClick={handleSendMail}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              title="一键调用系统邮件客户端发送反馈给开发者"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>邮件直发反馈</span>
            </button>

            {/* GitHub Issue */}
            <button
              onClick={handleOpenGitHubIssue}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              title="在 GitHub 仓库提交 Issue 讨论"
            >
              <span>GitHub Issue</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
