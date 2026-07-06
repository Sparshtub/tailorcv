import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  Edit3,
  Eye
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Simple client-side Markdown to HTML parser
function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  let html = markdown;
  
  // Clean up carriage returns
  html = html.replace(/\r\n/g, '\n');
  
  // Headers
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  
  // Strong / Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Unordered Lists
  html = html.replace(/^\s*[\-\*]\s+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  // Clean up nested lists created by the regex
  html = html.replace(/<\/ul>\s*<ul>/g, '\n');
  
  // Paragraphs (lines that don't start with lists or headers)
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul') || trimmed.startsWith('</ul')) {
      return line;
    }
    return `<p>${line}</p>`;
  });
  
  return processedLines.filter(l => l.trim() !== '').join('\n');
}

export default function App() {
  // Core States
  const [extractedText, setExtractedText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [outputType, setOutputType] = useState<'resume' | 'cover_letter'>('resume');
  const [tailoredContent, setTailoredContent] = useState<string>('');
  
  // UI States
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [fileName, setFileName] = useState<string>('');
  const [showRawText, setShowRawText] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  
  // File drag states
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotating loading messages
  const [loadingMessage, setLoadingMessage] = useState<string>('Analyzing content...');
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      const messages = [
        'Analyzing resume keywords...',
        'Matching experience to job description...',
        'Gemini is rewriting bullet points...',
        'Polishing professional language...',
        'Structuring tailored sections...',
        'Almost ready...'
      ];
      let counter = 0;
      interval = setInterval(() => {
        counter = (counter + 1) % messages.length;
        setLoadingMessage(messages[counter]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle File Input Select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  // Upload file API call
  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file only.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExtractedText(response.data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error || 
        'Failed to parse PDF. Make sure the server is running on port 5000.'
      );
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  };

  // Generate Tailored Output API call
  const handleGenerate = async () => {
    if (!extractedText) {
      setErrorMessage('Please upload a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please paste a job description.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setTailoredContent('');

    try {
      const response = await axios.post(`${API_BASE_URL}/tailor`, {
        resumeText: extractedText,
        jobDescription: jobDescription,
        type: outputType
      });
      setTailoredContent(response.data.content);
      setActiveTab('preview');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.error || 
        'Failed to tailor content. Check server configuration or your Gemini API Key.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Export PDF API call
  const handleExportPDF = async () => {
    if (!tailoredContent.trim()) return;

    setErrorMessage(null);
    setIsExporting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/export`, 
        { text: tailoredContent },
        { responseType: 'blob' }
      );

      // Create download link for PDF blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${outputType === 'resume' ? 'Tailored_Resume' : 'Cover_Letter'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to generate and download PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset E2E Flow
  const handleReset = () => {
    setExtractedText('');
    setJobDescription('');
    setTailoredContent('');
    setFileName('');
    setErrorMessage(null);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <FileCheck style={{ color: '#8B5CF6', width: '36px', height: '36px' }} />
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '800', background: 'linear-gradient(to right, #6366F1, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TailorCV
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '5px' }}>
          Instantly align your resume and cover letter with any job description using Gemini AI.
        </p>
      </header>

      {/* Error Alert */}
      {errorMessage && (
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '30px', borderColor: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle style={{ color: 'var(--error)', flexShrink: 0 }} />
          <div style={{ color: 'var(--text-primary)', fontSize: '14px', textAlign: 'left' }}>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Step 1: Upload Panel (If no resume is uploaded yet) */}
        {!extractedText ? (
          <section className="glass-card" style={{ padding: '40px 30px', maxWidth: '640px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>1. Upload Your Resume</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Upload your current resume as a PDF. We will extract the text server-side so our AI can rewrite it.
            </p>

            <div 
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              {isUploading ? (
                <>
                  <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
                  <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Extracting text from PDF...</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>This takes just a second.</p>
                </>
              ) : (
                <>
                  <Upload className="dropzone-icon" />
                  <p style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    Drag & drop your PDF resume here, or <span style={{ color: 'var(--secondary)', textDecoration: 'underline' }}>browse</span>
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Supported format: PDF (Max 5MB)</p>
                </>
              )}
            </div>
          </section>
        ) : (
          /* Step 2: Dashboard (Resume text uploaded) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Panel: Inputs (Resume Extracted Text + Job Description) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Resume Status Card */}
              <section className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle style={{ color: 'var(--success)', width: '20px', height: '20px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Loaded: {fileName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => setShowRawText(!showRawText)}
                    >
                      {showRawText ? 'Hide Text' : 'View Text'}
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--error)' }}
                      onClick={handleReset}
                    >
                      <Trash2 style={{ width: '12px', height: '12px' }} /> Reset
                    </button>
                  </div>
                </div>

                {/* Collapsible raw text view */}
                {showRawText && (
                  <div style={{ marginTop: '16px', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', maxHeight: '200px', overflowY: 'auto', textAlign: 'left' }}>
                    <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                      {extractedText}
                    </pre>
                  </div>
                )}
              </section>

              {/* Job Description Input & Options */}
              <section className="glass-card" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                  2. Job Posting Details
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                  Paste the job description (responsibilities, requirements, qualifications) below.
                </p>

                <textarea 
                  className="input-field"
                  placeholder="Paste job posting text here..."
                  rows={8}
                  style={{ resize: 'vertical', marginBottom: '20px' }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isGenerating}
                />

                {/* Choice: Resume vs Cover Letter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    What output would you like to generate?
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className={`btn ${outputType === 'resume' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '10px' }}
                      onClick={() => setOutputType('resume')}
                      disabled={isGenerating}
                    >
                      Tailor Resume Bullets
                    </button>
                    <button 
                      className={`btn ${outputType === 'cover_letter' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '10px' }}
                      onClick={() => setOutputType('cover_letter')}
                      disabled={isGenerating}
                    >
                      Draft Cover Letter
                    </button>
                  </div>
                </div>

                {/* Generate Action Button */}
                <button 
                  className="btn btn-primary pulse-glow"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDescription.trim()}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="loading-spinner" style={{ width: '16px', height: '16px', animation: 'spin 1.5s linear infinite' }} />
                      {loadingMessage}
                    </>
                  ) : (
                    `Generate Tailored ${outputType === 'resume' ? 'Resume' : 'Cover Letter'}`
                  )}
                </button>
              </section>
            </div>

            {/* Right Panel: Tailored AI Output */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <section className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '520px', boxSizing: 'border-box' }}>
                
                {/* Output Header */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-primary)' }}>
                    3. Tailored Output
                  </h2>
                  
                  {tailoredContent && (
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', marginLeft: 'auto' }}>
                      <button 
                        className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: activeTab === 'preview' ? '' : 'transparent', border: 'none' }}
                        onClick={() => setActiveTab('preview')}
                      >
                        <Eye style={{ width: '12px', height: '12px' }} /> Preview Layout
                      </button>
                      <button 
                        className={`btn ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: activeTab === 'edit' ? '' : 'transparent', border: 'none' }}
                        onClick={() => setActiveTab('edit')}
                      >
                        <Edit3 style={{ width: '12px', height: '12px' }} /> Edit Raw
                      </button>
                    </div>
                  )}
                </div>

                {/* Conditional Output Panel Display */}
                {!tailoredContent && !isGenerating ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '12px', padding: '40px 0' }}>
                    <FileText style={{ width: '64px', height: '64px', opacity: 0.3 }} />
                    <p style={{ textAlign: 'center', fontSize: '14px' }}>
                      Pasted job posting details on the left, then click generate.
                      The tailored document will load here for you to edit and export.
                    </p>
                  </div>
                ) : isGenerating ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px 0' }}>
                    <div className="loading-spinner" style={{ width: '56px', height: '56px', borderWidth: '4px' }} />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>Generating content via Gemini...</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{loadingMessage}</p>
                    </div>
                  </div>
                ) : (
                  /* Output Loaded */
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                    
                    {/* Active tab contents */}
                    <div style={{ flex: 1 }}>
                      {activeTab === 'edit' ? (
                        <textarea
                          className="input-field"
                          style={{ width: '100%', height: '360px', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical' }}
                          value={tailoredContent}
                          onChange={(e) => setTailoredContent(e.target.value)}
                        />
                      ) : (
                        <div className="glass-card" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#2d3748', overflowY: 'auto', height: '360px', boxSizing: 'border-box' }}>
                          {/* We inject our rendered markdown HTML into the white page container */}
                          <div 
                            className="markdown-preview"
                            style={{ color: '#2d3748' }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(tailoredContent) }}
                          />
                        </div>
                      )}
                    </div>

                    {/* PDF Export trigger button */}
                    <button 
                      className="btn btn-primary pulse-glow"
                      style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                      onClick={handleExportPDF}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <>
                          <RefreshCw className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                          Compiling HTML to PDF using Puppeteer...
                        </>
                      ) : (
                        <>
                          <Download style={{ width: '18px', height: '18px' }} />
                          Export & Download as Polished PDF
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>
        TailorCV - Built with React, Express, pdf-parse, Puppeteer, and Gemini AI.
      </footer>
    </div>
  );
}
