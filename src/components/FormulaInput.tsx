import React, { useMemo, useState } from 'react';
import { LatexValidator } from '../core/parser/latexValidator';
import { LatexCleaner } from '../core/parser/latexCleaner';
import { Code2, Trash2, Wand2, AlertCircle, Image as ImageIcon, Check } from 'lucide-react';

interface FormulaInputProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  onOpenImageUpload: () => void;
}

export const FormulaInput: React.FC<FormulaInputProps> = ({
  value,
  onChange,
  onClear,
  onOpenImageUpload
}) => {
  const [restoredToast, setRestoredToast] = useState<string | null>(null);

  // 实时语法校验
  const validation = useMemo(() => {
    return LatexValidator.validate(value);
  }, [value]);

  const charCount = value.length;

  // 智能拦截粘贴事件：处理图片截图粘贴、富文本 / KaTeX annotation / <sup><sub> / Unicode 还原以及多行错位公式重构
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // 0. 若剪贴板含有图片截图 (如截图公式后直接在输入框按 Ctrl+V 粘贴)
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          onOpenImageUpload();
          triggerToast('📷 检测到公式截图，已自动打开图片公式识别窗口！');
          return;
        }
      }
    }

    const html = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    // 1. 若剪贴板含有 HTML 富文本 (如从网页划词复制 KaTeX / MathJax / Word)，尝试提取原始 LaTeX
    if (html) {
      const extracted = LatexCleaner.extractFromHtml(html);
      if (extracted && extracted.trim()) {
        e.preventDefault();
        const cleaned = LatexCleaner.normalizeUnicodeSymbols(extracted);
        const reconstructed = LatexCleaner.reconstructMultilineFormula(cleaned);
        onChange(reconstructed);
        triggerToast('已自动从网页剪贴板还原完整 LaTeX 公式与上下角标！');
        return;
      }
    }

    // 2. 若粘贴的是纯文本：自动进行 Unicode 还原与多行错位公式重组 (如超几何函数多行复制)
    if (plainText) {
      const normalized = LatexCleaner.normalizeUnicodeSymbols(plainText);
      const reconstructed = LatexCleaner.reconstructMultilineFormula(normalized);
      if (reconstructed && reconstructed !== plainText) {
        e.preventDefault();
        onChange(reconstructed);
        if (reconstructed.includes('{}_') || reconstructed.includes('\\sum_{')) {
          triggerToast('✨ 检测到带有换行错位的复杂公式（如超几何函数），已自动智能重构为标准 LaTeX！');
        } else {
          triggerToast('已自动清洗换行格式并还原 LaTeX 标准角标 (^ 与 _)！');
        }
      }
    }
  };

  const triggerToast = (msg: string) => {
    setRestoredToast(msg);
    setTimeout(() => setRestoredToast(null), 3500);
  };

  // 执行智能提取与清洗
  const handleSmartClean = () => {
    const res = LatexCleaner.clean(value);
    const reconstructed = LatexCleaner.reconstructMultilineFormula(res.cleaned || value);
    if (reconstructed && reconstructed !== value) {
      onChange(reconstructed);
      triggerToast('✨ 已智能清洗并重组多行错位公式与上下角标！');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
      {/* 顶部工具栏 */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>LaTeX 公式源码输入</span>
          </div>

          {/* 切换至图片识别入口 */}
          <button
            onClick={onOpenImageUpload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors border border-blue-200/60"
            title="支持上传图片或直接按 Ctrl+V 粘贴公式截图进行 AI 识别"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>图片公式识别</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1 py-0.2 rounded-xs">
              AI 识图
            </span>
          </button>
        </div>

        {/* 右侧操作按钮 */}
        <div className="flex items-center gap-1.5">
          {/* 智能清洗按钮 */}
          <button
            onClick={handleSmartClean}
            disabled={!value.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            title="自动去除 Markdown 代码块、AI 解释性前缀、还原上下标与外层 $$ 符号"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">智能清洗/还原角标</span>
          </button>

          {/* 清空按钮 */}
          <button
            onClick={onClear}
            disabled={!value.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            title="清空输入框"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">清空</span>
          </button>
        </div>
      </div>

      {/* 粘贴角标还原反馈提示条 */}
      {restoredToast && (
        <div className="px-3.5 py-1.5 bg-blue-500 text-white text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-3.5 h-3.5" />
          <span>{restoredToast}</span>
        </div>
      )}

      {/* 文本编辑区域 */}
      <div className="relative flex-1 min-h-[220px] p-3 flex flex-col">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={`在此粘贴 LaTeX 公式代码或直接粘贴网页公式：
• 支持自动从网页/AI对话复制内容中还原完整上下角标 (^ 和 _)
• 行内公式：$...$ 或 \\(...\\)
• 行间公式：$$...$$ 或 \\[...\\]
• 复杂环境：\\begin{equation}、\\begin{pmatrix} 等`}
          className="w-full flex-1 resize-y min-h-[180px] p-3 font-mono text-sm leading-relaxed text-slate-800 bg-slate-50/30 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          spellCheck={false}
        />

        {/* 底部信息栏：字符数统计与快捷键提示 */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono">
              字符数:{' '}
              <span
                className={`font-semibold ${
                  charCount > 2000
                    ? 'text-rose-600'
                    : charCount > 1000
                    ? 'text-amber-600'
                    : 'text-slate-700'
                }`}
              >
                {charCount}
              </span>
              <span className="text-slate-400"> (支持1000+字符)</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            按 <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600">Enter</kbd> 快捷转换
          </div>
        </div>

        {/* 实时语法校验提示 */}
        {!validation.valid && validation.errors.length > 0 && (
          <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-900">
                {validation.errors[0].message}
              </div>
              {validation.errors[0].suggestion && (
                <div className="text-amber-700 text-[11px] mt-0.5">
                  💡 建议：{validation.errors[0].suggestion}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
