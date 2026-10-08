import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { Eye, ZoomIn, ZoomOut, RotateCcw, AlertCircle, Copy, Check, Download, Sparkles, HelpCircle } from 'lucide-react';
import { WordClipboard } from '../core/converter/wordClipboard';
import { DocxExporter } from '../core/converter/docxExporter';

interface FormulaPreviewProps {
  latex: string;
  omml?: string;
  mathml?: string;
  isInline?: boolean;
  hasConverted?: boolean;
  onOpenGuide?: () => void;
}

export const FormulaPreview: React.FC<FormulaPreviewProps> = ({
  latex,
  omml = '',
  mathml = '',
  isInline = false,
  hasConverted = false,
  onOpenGuide
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!latex || !latex.trim()) {
      containerRef.current.innerHTML = '';
      setRenderError(null);
      return;
    }

    try {
      katex.render(latex, containerRef.current, {
        displayMode: !isInline,
        throwOnError: true,
        output: 'htmlAndMathml'
      });
      setRenderError(null);
    } catch (err: any) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode: !isInline,
          throwOnError: false
        });
        setRenderError(null);
      } catch (fallbackErr: any) {
        setRenderError(err.message || String(err));
      }
    }
  }, [latex, isInline]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // 一键复制到 Word
  const handleCopyWord = async () => {
    if (!omml) return;
    const res = await WordClipboard.copyForWord(omml, mathml);
    if (res.success) {
      setCopied(true);
      setFeedbackMsg('已复制公式！在 Word 中直接按 Ctrl+V 即可自动生成原生公式');
      setTimeout(() => {
        setCopied(false);
        setFeedbackMsg(null);
      }, 3500);
    }
  };

  // 导出 Word (.docx)
  const handleExportDocx = async () => {
    if (!omml) return;
    try {
      setIsExporting(true);
      await DocxExporter.exportFormulaDocx(omml, latex);
    } catch (err: any) {
      alert('导出 Word 文档失败: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
      {/* 顶部工具栏：标题、缩放与核心复制按钮 */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>数学公式格式化预览</span>
          </div>

          {/* 缩放控制 */}
          <div className="flex items-center gap-0.5 text-slate-600 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 font-medium select-none min-w-[36px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 250}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-30"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors border-l border-slate-100 ml-0.5"
              title="重置缩放"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 预览卡片右侧快捷操作：直接放置最核心的复制按钮 */}
        <div className="flex items-center gap-2">
          {/* 一键复制到 Word 核心按钮 */}
          <button
            onClick={handleCopyWord}
            disabled={!hasConverted || !omml}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
              !hasConverted || !omml
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : copied
                ? 'bg-emerald-600 shadow-emerald-500/25'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-500/20'
            }`}
            title="复制到剪贴板，可直接在 Microsoft Word 中按 Ctrl+V 粘贴"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已复制！</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>一键复制到 Word</span>
              </>
            )}
          </button>

          {/* 下载 docx */}
          <button
            onClick={handleExportDocx}
            disabled={!hasConverted || !omml || isExporting}
            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40"
            title="下载包含该公式的 .docx 文档"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* 指南 */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Word 粘贴说明"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 复制成功即时反馈条 */}
      {feedbackMsg && (
        <div className="bg-emerald-500 text-white px-4 py-2 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
          <span className="text-[11px] text-emerald-100">打开Word按 Ctrl+V 即可</span>
        </div>
      )}

      {/* 预览展示区域 */}
      <div className="flex-1 min-h-[180px] p-6 flex items-center justify-center bg-radial from-white via-slate-50/40 to-slate-100/30 overflow-auto">
        {!latex || !latex.trim() ? (
          <div className="text-center text-slate-400 select-none">
            <div className="text-sm font-medium">暂无公式内容</div>
            <div className="text-xs text-slate-400 mt-1">
              在左侧输入公式或选择示例后在此显示高清排版预览
            </div>
          </div>
        ) : renderError ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 max-w-md">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>渲染预览提示</span>
            </div>
            <div className="font-mono">{renderError}</div>
          </div>
        ) : (
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            className="transition-transform duration-150 p-4"
          >
            <div ref={containerRef} className="katex-container select-text text-slate-900" />
          </div>
        )}
      </div>

      {/* 预览底部简明辅助操作条 */}
      {hasConverted && omml && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-medium text-emerald-700">💡 提示：</span>
            <span>直接在 Word 中按 <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800">Ctrl + V</kbd> 粘贴。若版本受限显示为代码，按 <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800">Alt + =</kbd> 后按 Ctrl+V 即可。</span>
          </div>
          <button
            onClick={handleCopyWord}
            className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1 hover:underline"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>再次复制</span>
          </button>
        </div>
      )}
    </div>
  );
};
