import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Key,
  AlertCircle,
  Loader2,
  Cpu,
  Globe,
  RefreshCw
} from 'lucide-react';
import { QwenVisionService } from '../core/vision/qwenVisionService';
import { LocalVisionService } from '../core/vision/localVisionService';
import { MockVisionService } from '../core/vision/mockVisionService';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormulaRecognized: (latex: string) => void;
}

type VisionEngineType = 'cloud' | 'local' | 'mock';

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onFormulaRecognized
}) => {
  const [engineType, setEngineType] = useState<VisionEngineType>('cloud');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [localStatus, setLocalStatus] = useState<{ online: boolean; model?: string; checking: boolean }>({
    online: false,
    checking: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const qwenService = useRef(new QwenVisionService()).current;
  const localService = useRef(new LocalVisionService()).current;
  const mockService = useRef(new MockVisionService()).current;

  // 初始化 API Key 与检测本地服务状态
  useEffect(() => {
    if (isOpen) {
      setApiKey(qwenService.getApiKey());
      checkLocalHealth();
    }
  }, [isOpen]);

  // 检测本地服务健康度
  const checkLocalHealth = async () => {
    setLocalStatus(prev => ({ ...prev, checking: true }));
    const health = await localService.checkHealth();
    setLocalStatus({
      online: health.online,
      model: health.model,
      checking: false
    });
    // 若本地服务在线且未配云端 Key，推荐自动选本地
    if (health.online && !qwenService.isConfigured()) {
      setEngineType('local');
    }
  };

  // 处理图片选择
  const handleFileChange = (file: File) => {
    const val = qwenService.validateImage(file);
    if (!val.valid) {
      setErrorMsg(val.error || '文件格式不支持');
      return;
    }
    setErrorMsg(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // 剪贴板粘贴截图监听
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileChange(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // 保存 API Key
  const handleSaveApiKey = () => {
    qwenService.setApiKey(apiKey);
    setShowKeyConfig(false);
  };

  // 触发公式识别
  const handleRecognize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      let res;
      if (engineType === 'local') {
        res = await localService.recognizeFormula(selectedFile);
      } else if (engineType === 'cloud') {
        if (!qwenService.isConfigured()) {
          // 若云端未配置，自动回退到模拟或提示配置
          res = await mockService.recognizeFormula(selectedFile);
        } else {
          res = await qwenService.recognizeFormula(selectedFile);
        }
      } else {
        res = await mockService.recognizeFormula(selectedFile);
      }

      if (res.success && res.latex) {
        onFormulaRecognized(res.latex);
        onClose();
      } else {
        setErrorMsg(res.error || '未能从图片中解析出有效数学公式');
      }
    } catch (err: any) {
      setErrorMsg(err.message || '识别过程遇到异常');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 标题栏 */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 m-0">图片公式识别 (Image-to-LaTeX)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  多引擎就绪
                </span>
              </div>
              <p className="text-xs text-slate-500 m-0">
                支持 Qwen-VL 云端大模型 / 本地 LaTeX-OCR 离线微服务双模式
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

        {/* 引擎切换 Tabs */}
        <div className="px-5 pt-3 bg-slate-50/50 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setEngineType('cloud')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${
              engineType === 'cloud'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>通义千问 Qwen-VL (云端)</span>
          </button>

          <button
            onClick={() => setEngineType('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${
              engineType === 'local'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>本地离线 OCR (pix2tex)</span>
            <span
              className={`w-2 h-2 rounded-full ${
                localStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
              title={localStatus.online ? '本地服务在线' : '本地服务未连接'}
            />
          </button>

          <button
            onClick={() => setEngineType('mock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all border-b-2 ${
              engineType === 'mock'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>内置示例</span>
          </button>
        </div>

        {/* 主体区域 */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {/* 本地服务状态指示卡片 */}
          {engineType === 'local' && (
            <div className={`p-3 rounded-xl border text-xs ${
              localStatus.online
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2.5 h-2.5 rounded-full ${localStatus.online ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{localStatus.online ? '本地离线服务已就绪' : '未检测到本地 Sidecar 服务'}</span>
                </div>
                <button
                  onClick={checkLocalHealth}
                  disabled={localStatus.checking}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                >
                  <RefreshCw className={`w-3 h-3 ${localStatus.checking ? 'animate-spin' : ''}`} />
                  <span>重新探测</span>
                </button>
              </div>

              {localStatus.online ? (
                <p className="m-0 text-[11px] text-emerald-800">
                  已连接 <code>127.0.0.1:8000</code>，模型: <strong>{localStatus.model || 'LaTeX-OCR (pix2tex)'}</strong>。纯本地推理，无需联网，速度约 0.2s！
                </p>
              ) : (
                <div className="space-y-1 text-[11px] text-amber-800">
                  <p className="m-0">
                    一键启动方式：双击运行项目中的 <code>backend/start.bat</code>（或执行 <code>python backend/app.py</code>）。
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 拖拽上传与粘贴区域 */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50'
                : previewUrl
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {previewUrl ? (
              <div className="space-y-2">
                <img
                  src={previewUrl}
                  alt="公式预览"
                  className="max-h-36 mx-auto rounded-lg shadow-xs border border-slate-200"
                />
                <div className="text-xs text-slate-600 font-medium">
                  {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(1)} KB)
                </div>
                <div className="text-[11px] text-blue-600 font-semibold">点击重新选择图片</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  拖拽公式截图至此，或点击上传文件
                </div>
                <div className="text-[11px] text-slate-400">
                  支持快捷键截屏后直接按 <kbd className="px-1 py-0.5 bg-slate-100 rounded border text-slate-600 font-mono">Ctrl + V</kbd> 粘贴 (PNG, JPG, WebP)
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Qwen API Key 配置折叠 (云端模式下展示) */}
          {engineType === 'cloud' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100/70 text-left text-xs font-semibold text-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>配置 Qwen DashScope API Key</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {showKeyConfig ? '收起' : apiKey ? '已配置 (已启用大模型)' : '点击配置'}
                </span>
              </button>

              {showKeyConfig && (
                <div className="p-3 space-y-2 bg-white border-t border-slate-100 text-xs">
                  <p className="text-[11px] text-slate-500 m-0">
                    填入阿里云百炼 DashScope API Key（注册送免费额度），直连 Qwen2.5-VL 多模态千亿视觉模型，保存在本地浏览器中。
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮栏 */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-500">
            {engineType === 'local' && (localStatus.online ? '🟢 本地毫秒级推理' : '⚪ 本地未启动')}
            {engineType === 'cloud' && (apiKey ? '🌐 Qwen2.5-VL 就绪' : '⚡ 未配置 Key，将自动使用体验示例')}
            {engineType === 'mock' && '⚡ 典型公式内置体验'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/50"
            >
              取消
            </button>
            <button
              onClick={handleRecognize}
              disabled={!selectedFile || isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {engineType === 'local'
                  ? '本地 LaTeX-OCR 识别'
                  : engineType === 'cloud' && apiKey
                  ? '调用 Qwen-VL 识别'
                  : '开始公式识别'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
