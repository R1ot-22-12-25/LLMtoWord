import { X, Keyboard, Lightbulb } from 'lucide-react';

interface PasteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasteGuideModal: React.FC<PasteGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 标题 */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                Microsoft Word 公式粘贴与使用指南
              </h3>
              <p className="text-xs text-slate-500 m-0">
                适配 Word 2016、2019、2021、Office 365 及 WPS Office
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
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* 步骤 1 */}
          <div className="flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm m-0">
                方式一：直接粘贴（最推荐）
              </h4>
              <p className="text-xs text-slate-600 m-0 leading-relaxed">
                在网页上点击「<strong>一键复制到 Word</strong>」按钮，然后切换至 Microsoft Word 正在编辑的文档，光标停在所需位置，直接按键盘快捷键：
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 flex items-center gap-2">
                <span className="font-sans font-semibold text-blue-700">快捷键：</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded shadow-2xs font-bold text-slate-900">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded shadow-2xs font-bold text-slate-900">V</kbd>
              </div>
              <p className="text-[11px] text-slate-500 m-0">
                Word 会自动识别剪贴板中的 OMML 与 Office Math HTML 数据，直接转换为原生可编辑的公式对象，字号、上下标、根号等均严格保持完美排版！
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 步骤 2 */}
          <div className="flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm m-0">
                方式二：插入公式框后粘贴（若方式一显示为纯文本）
              </h4>
              <p className="text-xs text-slate-600 m-0 leading-relaxed">
                部分特定设置的 Word 版本若未开启富文本格式粘贴，可按以下标准步骤：
              </p>
              <ol className="text-xs text-slate-600 space-y-1 pl-4 list-decimal">
                <li>在 Word 中按下 <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono font-bold">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono font-bold">=</kbd>（插入原生空公式框）。</li>
                <li>在出现的公式虚线框内按下 <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono font-bold">V</kbd> 粘贴。</li>
              </ol>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* 步骤 3 */}
          <div className="flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm m-0">
                方式三：一键下载 .docx 文档（零失败率验证）
              </h4>
              <p className="text-xs text-slate-600 m-0 leading-relaxed">
                若因操作系统剪贴板权限或外部软件拦截导致剪贴板异常，可直接点击「<strong>下载 .docx</strong>」按钮，本工具将直接在本地打包生成嵌入了原生 OMML 公式的 Word 文档，双击即可无缝编辑！
              </p>
            </div>
          </div>

          {/* 提示条 */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">无需安装任何第三方插件：</span>
              <span className="text-blue-800">
                生成的 OMML 是微软 Office 官方标准的底层数学语言，无需 MathType 或 AxMath，在 Word 2016、2019、2021、365 及 WPS Office 中均可获得一致的排版效果与跨平台兼容性。
              </span>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            知道了，立即体验
          </button>
        </div>
      </div>
    </div>
  );
};
