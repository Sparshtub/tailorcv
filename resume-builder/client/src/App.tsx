import { useState } from 'react';
import axios from 'axios';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import TemplatePicker from './components/TemplatePicker';
import TailoredOutput from './components/TailoredOutput';
import ResumePreview from './components/ResumePreview';
import CustomTemplateInput from './components/CustomTemplateInput';
import { Sparkles, Download, RefreshCw, CheckCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ResumeData {
  name: string;
  contact: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

interface CoverLetterData {
  name: string;
  contact: string;
  content: string;
}

const INITIAL_RESUME: ResumeData = {
  name: '',
  contact: '',
  summary: '',
  experience: '',
  education: '',
  skills: ''
};

const INITIAL_COVER_LETTER: CoverLetterData = {
  name: '',
  contact: '',
  content: ''
};

export default function App() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [outputType, setOutputType] = useState<'resume' | 'cover-letter'>('resume');
  
  // Custom Styling
  const [templateId, setTemplateId] = useState<string>('prism');
  const [accentColor, setAccentColor] = useState<string>('#7c3aed');
  const [fontFamily, setFontFamily] = useState<string>('Inter');

  // AI & Export states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [customHtmlTemplate, setCustomHtmlTemplate] = useState<string | null>(null);
  
  // Generated structured results
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(INITIAL_COVER_LETTER);

  // Status updates
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleUploadSuccess = (text: string, _name: string) => {
    setResumeText(text);
    
    // Auto populate candidate name as placeholder if possible (or keep blank)
    setResumeData({
      ...INITIAL_RESUME,
      name: 'John Doe', // default mock placeholder
      contact: 'john.doe@example.com | (555) 123-4567 | San Francisco, CA'
    });
    setCoverLetterData({
      ...INITIAL_COVER_LETTER,
      name: 'John Doe',
      contact: 'john.doe@example.com | (555) 123-4567 | San Francisco, CA'
    });

    showNotification('Resume text extracted successfully! Ready for AI tailoring.', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleGenerate = async () => {
    if (!resumeText) {
      showNotification('Please upload your resume PDF first.', 'error');
      return;
    }
    if (!jobDescription.trim()) {
      showNotification('Please paste a job description.', 'error');
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/tailor`, {
        resumeText,
        jobDescription,
        type: outputType
      });

      if (outputType === 'resume') {
        setResumeData(response.data);
      } else {
        setCoverLetterData(response.data);
      }

      setHasGenerated(true);
      showNotification(`Successfully tailored your ${outputType}!`, 'success');
    } catch (err: any) {
      console.error(err);
      showNotification(err.response?.data?.error || 'AI Tailoring failed. Please check backend connection.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const payload = {
        templateId,
        data: outputType === 'resume' ? resumeData : coverLetterData,
        styles: { accentColor, fontFamily },
        type: outputType,
        customHtmlTemplate
      };

      const response = await axios.post(`${BACKEND_URL}/api/export`, payload, {
        responseType: 'blob'
      });

      // Create a local blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const outputName = outputType === 'resume' ? resumeData.name : coverLetterData.name;
      link.download = `${(outputName || 'Candidate').replace(/\s+/g, '_')}_${outputType}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('PDF exported and downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to generate PDF. Check template syntax or server logs.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-sunset-violet via-sunset-pink to-sunset-orange rounded-xl text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-900 tracking-tight">TailorCV</h1>
              <p className="text-[10px] font-semibold text-gray-400">AI-Powered Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={!hasGenerated || isExporting}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl text-white shadow-md transition-all duration-300 cursor-pointer ${
                !hasGenerated || isExporting
                  ? 'bg-gray-300 shadow-none cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark hover:-translate-y-0.5 shadow-primary/10'
              }`}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Export as PDF
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8">
        {/* Left Side: Step Forms and Editor */}
        <div className="flex flex-col gap-6">
          {/* Status Notifications */}
          {notification && (
            <div 
              className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                  : 'bg-red-50 text-red-800 border-red-100'
              }`}
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{notification.message}</span>
            </div>
          )}

          {/* Section: Upload */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">1</span>
              <h2 className="text-sm font-bold text-gray-800">Upload Original Resume</h2>
            </div>
            <ResumeUpload onUploadSuccess={handleUploadSuccess} backendUrl={BACKEND_URL} />
          </div>

          {/* Section: Job Description & Target Alignment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">2</span>
              <h2 className="text-sm font-bold text-gray-800">Align with Job Posting</h2>
            </div>
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              outputType={outputType}
              onOutputTypeChange={setOutputType}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!resumeText}
            />
          </div>

          {/* Section: Interactive Output Editor */}
          {hasGenerated && (
            <div className="animate-fade-in duration-300">
              <TailoredOutput
                type={outputType}
                resumeData={resumeData}
                coverLetterData={coverLetterData}
                onResumeDataChange={setResumeData}
                onCoverLetterDataChange={setCoverLetterData}
              />
            </div>
          )}
        </div>

        {/* Right Side: Design Settings & Sticky Live Preview */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          {/* Controls Panel */}
          <TemplatePicker
            selectedTemplate={templateId}
            onTemplateChange={setTemplateId}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
            fontFamily={fontFamily}
            onFontFamilyChange={setFontFamily}
          />

          <CustomTemplateInput
            onTemplateLoaded={setCustomHtmlTemplate}
            onClearTemplate={() => setCustomHtmlTemplate(null)}
            isActive={!!customHtmlTemplate}
            backendUrl={BACKEND_URL}
          />

          {/* Live Page Preview */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Live Page Preview</span>
            <div className="rounded-xl overflow-hidden shadow-md">
              <ResumePreview
                templateId={templateId}
                type={outputType}
                resumeData={resumeData}
                coverLetterData={coverLetterData}
                styles={{ accentColor, fontFamily }}
                customHtmlTemplate={customHtmlTemplate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
