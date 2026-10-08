import React, { useState } from 'react';
import { FORMULA_PRESETS } from '../core/parser/presets';
import type { FormulaPreset } from '../core/types';
import { Sparkles, Layers } from 'lucide-react';

interface PresetSelectorProps {
  onSelectPreset: (preset: FormulaPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: '全部示例' },
    { key: 'algebra', label: '基础代数' },
    { key: 'calculus', label: '高等微积分' },
    { key: 'linear_algebra', label: '线性代数' },
    { key: 'physics', label: '现代物理' },
    { key: 'structures', label: '分段与环境' },
    { key: 'complex', label: 'AI与概率' }
  ];

  const filteredPresets =
    activeCategory === 'all'
      ? FORMULA_PRESETS
      : FORMULA_PRESETS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>快捷示例公式库</span>
          <span className="text-[10px] text-slate-400 font-normal">点击直接填入输入框</span>
        </div>
      </div>

      {/* 分类切换标签 */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 预设卡片列表 */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {filteredPresets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="flex-shrink-0 text-left bg-white hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg p-2 transition-all w-48 group shadow-2xs"
          >
            <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate mb-1 flex items-center justify-between">
              <span>{preset.name}</span>
              <Sparkles className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate bg-slate-50 px-1 py-0.5 rounded border border-slate-100">
              {preset.latex}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
