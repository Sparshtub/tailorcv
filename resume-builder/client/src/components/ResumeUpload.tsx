import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (text: string, filename: string) => void;
  backendUrl: string;
}

export default function ResumeUpload({ onUploadSuccess, backendUrl }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }

    setLoading(true);
    setError(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.text, file.name);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to extract text from PDF. Please try again.');
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">Resume Upload (PDF)</label>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          dragActive 
            ? 'border-sunset-pink bg-primary-light/30 scale-[0.99]' 
            : 'border-gray-300 bg-white hover:border-sunset-violet'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center py-4 space-y-3">
            <Loader2 className="h-10 w-10 text-sunset-violet animate-spin" />
            <p className="text-sm font-medium text-gray-600">Extracting text from resume...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center py-2 space-y-2">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-sm font-semibold text-gray-800">{fileName}</p>
            <button
              onClick={onButtonClick}
              className="text-xs font-medium text-sunset-pink hover:text-primary-dark underline cursor-pointer"
            >
              Upload another file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2 cursor-pointer" onClick={onButtonClick}>
            <div className="p-3 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-primary-light">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Drag and drop your PDF here, or <span className="text-sunset-violet font-bold">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports standard PDF resumes up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
