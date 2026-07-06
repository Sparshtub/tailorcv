import { useState, useRef } from 'react';
import axios from 'axios';
import { Sparkles, Upload, FileCode, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

interface CustomTemplateInputProps {
  onTemplateLoaded: (html: string) => void;
  onClearTemplate: () => void;
  isActive: boolean;
  backendUrl: string;
}

export default function CustomTemplateInput({
  onTemplateLoaded,
  onClearTemplate,
  isActive,
  backendUrl
}: CustomTemplateInputProps) {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a description for your design.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`${backendUrl}/api/template/generate`, {
        description
      });
      
      const generatedHtml = response.data.html;
      onTemplateLoaded(generatedHtml);
      setSuccessMessage('AI successfully generated your custom design template! View it in the preview.');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate custom template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await readHtmlFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await readHtmlFile(e.target.files[0]);
    }
  };

  const readHtmlFile = (file: File) => {
    if (!file.name.endsWith('.html')) {
      setError('Please upload an .html file only.');
      return;
    }

    setError(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Validate required placeholders
      const hasName = text.includes('{name}');
      const hasContact = text.includes('{contact}');

      if (!hasName || !hasContact) {
        setError('Invalid HTML template: missing required placeholders ({name} and {contact}).');
        return;
      }

      onTemplateLoaded(text);
      setSuccessMessage(`Successfully loaded custom template file: ${file.name}`);
    };
    reader.onerror = () => {
      setError('Failed to read the HTML template file.');
    };
    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <FileCode className="h-4 w-4 text-sunset-violet" />
          Custom Template Sandbox
        </h3>
        {isActive && (
          <button
            onClick={() => {
              onClearTemplate();
              setDescription('');
              setSuccessMessage(null);
              setError(null);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 py-1 px-2.5 rounded-lg transition cursor-pointer"
          >
            <X className="h-3 w-3" />
            Reset to Standard
          </button>
        )}
      </div>

      {isActive && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-semibold">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Custom layout is active and overriding default templates!</span>
        </div>
      )}

      {/* Option A: AI Generation */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-600">
          Option A: Design with AI (Type Description)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Sleek tech resume with navy borders and small serif text..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              isGenerating || !description.trim()
                ? 'bg-gray-300 shadow-none cursor-not-allowed'
                : 'bg-gradient-to-tr from-sunset-violet via-sunset-pink to-sunset-orange hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Generate
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Option B: Upload Template */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-600">
          Option B: Upload Custom HTML Template File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragActive
              ? 'border-sunset-pink bg-primary-light/20 scale-[0.99]'
              : 'border-gray-300 hover:border-sunset-violet bg-gray-50'
          }`}
        >
          <Upload className="h-5 w-5 text-gray-400 mb-1" />
          <span className="text-[11px] font-bold text-gray-700">
            Drag & drop .html template, or <span className="text-sunset-violet font-extrabold">browse</span>
          </span>
          <span className="text-[9px] text-gray-400 mt-0.5">
            Must contain placeholders: {"{name}"} and {"{contact}"}
          </span>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-semibold">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
