
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

interface ResumePreviewProps {
  templateId: string;
  type: 'resume' | 'cover-letter';
  resumeData: ResumeData;
  coverLetterData: CoverLetterData;
  styles: {
    accentColor: string;
    fontFamily: string;
  };
}

export default function ResumePreview({
  templateId,
  type,
  resumeData,
  coverLetterData,
  styles
}: ResumePreviewProps) {
  const { name, contact } = type === 'resume' ? resumeData : coverLetterData;
  const accent = styles.accentColor;
  const fontClass = styles.fontFamily;

  // Custom inline styles for the font family
  const containerStyle = {
    fontFamily: fontClass === 'Inter' 
      ? 'Inter, sans-serif'
      : fontClass === 'Merriweather'
      ? 'Merriweather, serif'
      : fontClass === 'Roboto'
      ? 'Roboto, sans-serif'
      : 'IBM Plex Sans, sans-serif'
  };

  const renderContact = () => (
    <div 
      className="text-[11px] leading-relaxed text-gray-600" 
      dangerouslySetInnerHTML={{ __html: contact || 'Contact details will appear here.' }} 
    />
  );

  const renderSkills = () => {
    if (type !== 'resume' || !resumeData.skills) return null;
    return (
      <div className="text-[11px] leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: resumeData.skills }} />
    );
  };

  // 1. PRISM LAYOUT PREVIEW
  if (templateId === 'prism') {
    return (
      <div 
        style={containerStyle}
        className="w-full bg-white shadow-lg border border-gray-100 flex aspect-[1/1.414] text-left select-none print:shadow-none"
      >
        {/* Sidebar */}
        <div 
          style={{ backgroundColor: `${accent}0c`, borderColor: `${accent}30` }}
          className="w-[32%] border-r p-6 flex flex-col gap-6"
        >
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{name || 'Your Name'}</h1>
            <span style={{ color: accent }} className="text-[9px] font-bold uppercase tracking-wider block mt-1">Candidate</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Contact</h2>
            {renderContact()}
          </div>

          {type === 'resume' && resumeData.skills && (
            <div className="flex flex-col gap-1.5">
              <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Skills</h2>
              {renderSkills()}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-[68%] p-8 flex flex-col gap-5 overflow-hidden">
          {type === 'resume' ? (
            <>
              {/* Summary */}
              {resumeData.summary && (
                <div className="flex flex-col gap-2">
                  <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Professional Summary</h2>
                  <p className="text-[11px] leading-relaxed text-gray-700">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience && (
                <div className="flex flex-col gap-2">
                  <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Work Experience</h2>
                  <div className="text-[11px] leading-relaxed text-gray-700 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.experience }} />
                </div>
              )}

              {/* Education */}
              {resumeData.education && (
                <div className="flex flex-col gap-2">
                  <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Education</h2>
                  <div className="text-[11px] leading-relaxed text-gray-700 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.education }} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <h2 style={{ color: accent, borderColor: `${accent}30` }} className="text-[10px] font-bold uppercase tracking-wider border-b pb-1">Cover Letter</h2>
              <div 
                className="text-[11px] leading-relaxed text-gray-700 whitespace-pre-line" 
                dangerouslySetInnerHTML={{ __html: coverLetterData.content || 'Cover letter will generate here.' }} 
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. CLASSIC LAYOUT PREVIEW
  if (templateId === 'classic') {
    return (
      <div 
        style={containerStyle}
        className="w-full bg-white shadow-lg border border-gray-100 p-8 flex flex-col gap-5 text-left select-none aspect-[1/1.414] print:shadow-none"
      >
        {/* Centered Header */}
        <div style={{ borderColor: accent }} className="flex flex-col items-center text-center gap-2 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{name || 'Your Name'}</h1>
          <div className="flex justify-center flex-wrap gap-x-3 text-[10px] text-gray-500">
            {renderContact()}
          </div>
        </div>

        {type === 'resume' ? (
          <>
            {/* Summary */}
            {resumeData.summary && (
              <div className="flex flex-col gap-1.5">
                <h2 style={{ color: accent }} className="text-[11px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">Professional Summary</h2>
                <p className="text-[11px] leading-relaxed text-gray-700">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience && (
              <div className="flex flex-col gap-1.5">
                <h2 style={{ color: accent }} className="text-[11px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">Work Experience</h2>
                <div className="text-[11px] leading-relaxed text-gray-700 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.experience }} />
              </div>
            )}

            {/* Education */}
            {resumeData.education && (
              <div className="flex flex-col gap-1.5">
                <h2 style={{ color: accent }} className="text-[11px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">Education</h2>
                <div className="text-[11px] leading-relaxed text-gray-700 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.education }} />
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && (
              <div className="flex flex-col gap-1.5">
                <h2 style={{ color: accent }} className="text-[11px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">Skills</h2>
                {renderSkills()}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-1.5">
            <h2 style={{ color: accent }} className="text-[11px] font-bold uppercase tracking-wider border-b border-gray-100 pb-1">Cover Letter</h2>
            <div 
              className="text-[11px] leading-relaxed text-gray-700 whitespace-pre-line" 
              dangerouslySetInnerHTML={{ __html: coverLetterData.content || 'Cover letter will generate here.' }} 
            />
          </div>
        )}
      </div>
    );
  }

  // 3. MINIMAL LAYOUT PREVIEW
  return (
    <div 
      style={containerStyle}
      className="w-full bg-white shadow-lg border border-gray-100 p-8 flex flex-col gap-5 text-left select-none aspect-[1/1.414] print:shadow-none"
    >
      {/* Split Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name || 'Your Name'}</h1>
          <span style={{ color: accent }} className="text-[10px] font-semibold tracking-wide">Candidate</span>
        </div>
        <div className="text-right">
          {renderContact()}
        </div>
      </div>

      {type === 'resume' ? (
        <>
          {/* Summary */}
          {resumeData.summary && (
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <h2 style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-wider">Summary</h2>
              <p className="text-[11px] leading-relaxed text-gray-600">{resumeData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience && (
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <h2 style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-wider">Experience</h2>
              <div className="text-[11px] leading-relaxed text-gray-600 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.experience }} />
            </div>
          )}

          {/* Education */}
          {resumeData.education && (
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <h2 style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-wider">Education</h2>
              <div className="text-[11px] leading-relaxed text-gray-600 preview-html-list" dangerouslySetInnerHTML={{ __html: resumeData.education }} />
            </div>
          )}

          {/* Skills */}
          {resumeData.skills && (
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <h2 style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-wider">Skills</h2>
              <div className="text-[11px] leading-relaxed text-gray-600" dangerouslySetInnerHTML={{ __html: resumeData.skills }} />
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <h2 style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-wider">Letter</h2>
          <div 
            className="text-[11px] leading-relaxed text-gray-600 whitespace-pre-line animate-fade-in" 
            dangerouslySetInnerHTML={{ __html: coverLetterData.content || 'Cover letter will generate here.' }} 
          />
        </div>
      )}
    </div>
  );
}
