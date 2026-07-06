import { Briefcase, FileText, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  outputType: 'resume' | 'cover-letter';
  onOutputTypeChange: (type: 'resume' | 'cover-letter') => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  outputType,
  onOutputTypeChange,
  onGenerate,
  isGenerating,
  disabled
}: JobDescriptionInputProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Paste Target Job Description
        </label>
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isGenerating}
            placeholder="Paste the job description here... (Gemini will analyze requirements, core keywords, and expected qualifications to customize your materials)"
            className="w-full h-44 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-sunset-violet focus:border-sunset-violet focus:outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Target Role Alignment</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 gap-1.5">
          <button
            type="button"
            onClick={() => onOutputTypeChange('resume')}
            disabled={isGenerating}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              outputType === 'resume'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            Tailor Resume
          </button>
          <button
            type="button"
            onClick={() => onOutputTypeChange('cover-letter')}
            disabled={isGenerating}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              outputType === 'cover-letter'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="h-4 w-4 text-sunset-pink" />
            Create Cover Letter
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={disabled || isGenerating || !value.trim()}
          className={`flex-shrink-0 px-6 py-3 font-semibold text-sm rounded-xl text-white shadow-md shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
            disabled || isGenerating || !value.trim()
              ? 'bg-gray-400 shadow-none cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark hover:-translate-y-0.5'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {outputType === 'resume' ? 'Tailor Resume' : 'Generate Cover Letter'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
