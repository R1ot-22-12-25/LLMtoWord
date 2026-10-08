import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { FormulaInput } from './components/FormulaInput';
import { FormulaPreview } from './components/FormulaPreview';
import { ConvertControls } from './components/ConvertControls';
import { OutputSection } from './components/OutputSection';
import { ImageUploadModal } from './components/ImageUploadModal';
import { PasteGuideModal } from './components/PasteGuideModal';
import { TestLabModal } from './components/TestLabModal';
import { ErrorReportModal } from './components/ErrorReportModal';
import { FormulaConverterEngine } from './core/converter/engine';
import { XsltEngine } from './core/converter/xsltEngine';
import type { FormulaPreset } from './core/types';

export const App: React.FC = () => {
  // 核心状态
  const [latexInput, setLatexInput] = useState<string>(
    'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
  );
  const [cleanLatex, setCleanLatex] = useState<string>('');
  const [omml, setOmml] = useState<string>('');
  const [mathml, setMathml] = useState<string>('');
  const [wordHtml, setWordHtml] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [hasConverted, setHasConverted] = useState<boolean>(false);
  const [autoConvert, setAutoConvert] = useState<boolean>(true);

  // 模态弹窗状态
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isTestLabOpen, setIsTestLabOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState<boolean>(false);

  // 引擎支持状态
  const [engineMode, setEngineMode] = useState<string>('Microsoft XSLT / 纯JS双引擎');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 核心执行转换逻辑
  const executeConversion = useCallback(async (input: string) => {
    if (!input || !input.trim()) {
      setOmml('');
      setMathml('');
      setWordHtml('');
      setCleanLatex('');
      setError(null);
      setSuggestion(null);
      setDurationMs(null);
      setHasConverted(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const res = await FormulaConverterEngine.convert(input);
      setDurationMs(res.durationMs);

      if (res.success) {
        setCleanLatex(res.cleanLatex);
        setMathml(res.mathml);
        setOmml(res.omml);
        setWordHtml(res.wordHtml);
        setHasConverted(true);
        setError(null);
        setSuggestion(null);
      } else {
        setError(res.error || '公式解析转换失败');
        setSuggestion(res.suggestion || null);
        setHasConverted(false);
      }
    } catch (err: any) {
      setError(err.message || '未知转换异常');
      setHasConverted(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载自动转换一次默认公式
  useEffect(() => {
    XsltEngine.init();
    if (XsltEngine.isSupported()) {
      setEngineMode('Office 官方 XSLT 核心');
    } else {
      setEngineMode('纯 JS 备用引擎');
    }
    executeConversion(latexInput);
  }, []);

  // 监听输入变化，支持 Debounced 自动转换
  const handleInputChange = (val: string) => {
    setLatexInput(val);
    if (autoConvert) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        executeConversion(val);
      }, 300);
    }
  };

  // 键盘快捷键监听 (Ctrl+Enter 转换)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeConversion(latexInput);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [latexInput, executeConversion]);

  // 选择预设示例公式
  const handleSelectPreset = (preset: FormulaPreset) => {
    setLatexInput(preset.latex);
    executeConversion(preset.latex);
  };

  // 清空
  const handleClear = () => {
    setLatexInput('');
    setCleanLatex('');
    setOmml('');
    setMathml('');
    setWordHtml('');
    setError(null);
    setSuggestion(null);
    setDurationMs(null);
    setHasConverted(false);
  };

  // 图片识别完成填入
  const handleFormulaRecognized = (recognizedLatex: string) => {
    setLatexInput(recognizedLatex);
    executeConversion(recognizedLatex);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 顶部导航 */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTestLab={() => setIsTestLabOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        engineMode={engineMode}
      />

      {/* 主体容器 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* 预设示例选择抽屉 */}
        <PresetSelector onSelectPreset={handleSelectPreset} />

        {/* 核心双栏排布：左侧输入区，右侧预览区 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* 输入区 */}
          <div className="h-full">
            <FormulaInput
              value={latexInput}
              onChange={handleInputChange}
              onClear={handleClear}
              onOpenImageUpload={() => setIsImageUploadOpen(true)}
            />
          </div>

          {/* 格式化高清预览区 (包含置顶一键复制到 Word 与操作) */}
          <div className="h-full">
            <FormulaPreview
              latex={cleanLatex || latexInput}
              omml={omml}
              mathml={mathml}
              hasConverted={hasConverted}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          </div>
        </div>

        {/* 控制区：转换按钮与状态耗时 */}
        <ConvertControls
          onConvert={() => executeConversion(latexInput)}
          isLoading={isLoading}
          durationMs={durationMs}
          error={error}
          suggestion={suggestion}
          autoConvert={autoConvert}
          onToggleAutoConvert={setAutoConvert}
          canConvert={latexInput.trim().length > 0}
        />

        {/* 底部紧凑折叠代码区 (供高级排查使用) */}
        <OutputSection
          omml={omml}
          mathml={mathml}
          latex={cleanLatex || latexInput}
          wordHtml={wordHtml}
          hasConverted={hasConverted}
        />
      </main>

      {/* 底部信息栏 */}
      <footer className="mt-8 border-t border-slate-200 bg-white/70 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>LLMtoWord © 2026 数学公式中间件 · 遵循 Office Math Markup Language (OMML) 规范</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>适配 Chrome 90+ / Edge 90+ / Firefox 88+</span>
            <span>·</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-blue-600 hover:underline"
            >
              粘贴说明
            </button>
            <span>·</span>
            <button
              onClick={() => setIsTestLabOpen(true)}
              className="text-indigo-600 hover:underline"
            >
              跑分基准
            </button>
          </div>
        </div>
      </footer>

      {/* 模态弹窗组件 */}
      <ImageUploadModal
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onFormulaRecognized={handleFormulaRecognized}
      />

      <PasteGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <TestLabModal
        isOpen={isTestLabOpen}
        onClose={() => setIsTestLabOpen(false)}
      />

      <ErrorReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        currentLatex={latexInput}
        errorMessage={error}
      />
    </div>
  );
};

export default App;
