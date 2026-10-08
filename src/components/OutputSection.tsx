import React, { useState } from 'react';
import { WordClipboard } from '../core/converter/wordClipboard';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Code
} from 'lucide-react';

interface OutputSectionProps {
  omml: string;
  mathml: string;
  latex: string;
  wordHtml: string;
  hasConverted: boolean;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  omml,
  mathml,
  latex,
  wordHtml,
  hasConverted
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'omml' | 'mathml' | 'wordHtml' | 'latex'>('omml');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!hasConverted || !omml) return null;

  const handleCopyText = async (type: string, text: string) => {
    if (!text) return;
    const success = await WordClipboard.copyPlainText(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'omml':
        return omml;
      case 'mathml':
        return mathml;
      case 'wordHtml':
        return wordHtml;
      case 'latex':
        return latex;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all text-xs">
      {/* 极简折叠标题栏 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-slate-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
          <Code className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">查看底层生成代码 (OMML / MathML / LaTeX)</span>
          <span className="text-[11px] text-slate-400">（供开发者或高级用途查看，日常使用只需在上方点击复制）</span>
        </div>
        <span className="text-[11px] text-blue-600 font-medium">
          {isExpanded ? '收起代码' : '点击展开'}
        </span>
      </button>

      {/* 展开后的紧凑内容区 */}
      {isExpanded && (
        <div className="border-t border-slate-100 animate-fadeIn">
          {/* 标签栏 */}
          <div className="px-4 py-2 bg-slate-100/50 border-b border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('omml')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === 'omml'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Word OMML
              </button>
              <button
                onClick={() => setActiveTab('mathml')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === 'mathml'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                标准 MathML
              </button>
              <button
                onClick={() => setActiveTab('wordHtml')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === 'wordHtml'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Word HTML 片段
              </button>
              <button
                onClick={() => setActiveTab('latex')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  activeTab === 'latex'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                规范化 LaTeX
              </button>
            </div>

            {/* 复制当前代码 */}
            <button
              onClick={() => handleCopyText(activeTab, getActiveContent())}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-blue-600 bg-white border border-slate-200 rounded transition-colors"
            >
              {copiedType === activeTab ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>复制代码</span>
                </>
              )}
            </button>
          </div>

          {/* 代码展示框 */}
          <div className="p-3 bg-slate-950 text-slate-300 font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed select-all">
            <pre className="whitespace-pre-wrap break-all m-0 font-mono">
              {getActiveContent()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
