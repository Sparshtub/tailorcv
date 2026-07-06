import { Palette, Type, Layout } from 'lucide-react';

interface TemplatePickerProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
}

const PRESET_COLORS = [
  { name: 'Sunset Violet', value: '#7c3aed' },
  { name: 'Sunset Pink', value: '#db2777' },
  { name: 'Sunset Orange', value: '#ea580c' },
  { name: 'Classic Navy', value: '#1e3a8a' },
  { name: 'Emerald', value: '#0f766e' },
];

const FONTS = [
  { name: 'Inter (Modern)', value: 'Inter' },
  { name: 'Merriweather (Serif/Classic)', value: 'Merriweather' },
  { name: 'Roboto (Clean)', value: 'Roboto' },
  { name: 'IBM Plex Sans (Technical)', value: 'IBM Plex Sans' }
];

export default function TemplatePicker({
  selectedTemplate,
  onTemplateChange,
  accentColor,
  onAccentColorChange,
  fontFamily,
  onFontFamilyChange
}: TemplatePickerProps) {
  return (
    <div className="w-full flex flex-col gap-5 bg-gray-50 border border-gray-200 rounded-xl p-5">
      {/* Template Preset Grid */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
          <Layout className="h-4 w-4 text-sunset-violet" />
          Choose Layout Template
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'prism', name: 'Prism Sidebar', desc: 'Left Sidebar' },
            { id: 'classic', name: 'Classic', desc: 'Traditional' },
            { id: 'minimal', name: 'Minimal', desc: 'Modern Clean' }
          ].map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onTemplateChange(tpl.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all cursor-pointer ${
                selectedTemplate === tpl.id
                  ? 'border-sunset-violet bg-white text-sunset-violet shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
              }`}
            >
              <span className="text-xs font-bold block">{tpl.name}</span>
              <span className="text-[10px] text-gray-400 mt-1">{tpl.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style settings row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Color picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Palette className="h-4 w-4 text-sunset-pink" />
            Accent Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onAccentColorChange(color.value)}
                style={{ backgroundColor: color.value }}
                title={color.name}
                className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
                  accentColor === color.value
                    ? 'border-gray-800 scale-110 shadow-sm'
                    : 'border-transparent hover:scale-105'
                }`}
              />
            ))}
            <input
              type="color"
              value={accentColor}
              onChange={(e) => onAccentColorChange(e.target.value)}
              title="Custom Color"
              className="h-6 w-6 rounded-full border border-gray-300 overflow-hidden cursor-pointer"
            />
          </div>
        </div>

        {/* Font Picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Type className="h-4 w-4 text-sunset-orange" />
            Typography Font
          </label>
          <select
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="w-full text-xs font-medium bg-white border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-sunset-violet focus:border-sunset-violet focus:outline-none"
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
