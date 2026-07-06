import { Edit3, User, Mail, FileText, Briefcase, GraduationCap, Code } from 'lucide-react';

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

interface TailoredOutputProps {
  type: 'resume' | 'cover-letter';
  resumeData: ResumeData;
  coverLetterData: CoverLetterData;
  onResumeDataChange: (data: ResumeData) => void;
  onCoverLetterDataChange: (data: CoverLetterData) => void;
}

export default function TailoredOutput({
  type,
  resumeData,
  coverLetterData,
  onResumeDataChange,
  onCoverLetterDataChange
}: TailoredOutputProps) {

  const handleResumeFieldChange = (field: keyof ResumeData, value: string) => {
    onResumeDataChange({
      ...resumeData,
      [field]: value
    });
  };

  const handleCoverLetterFieldChange = (field: keyof CoverLetterData, value: string) => {
    onCoverLetterDataChange({
      ...coverLetterData,
      [field]: value
    });
  };

  if (type === 'resume') {
    return (
      <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
          <Edit3 className="h-4 w-4 text-sunset-violet" />
          Edit Tailored Resume Sections
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={resumeData.name}
              onChange={(e) => handleResumeFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <Mail className="h-3.5 w-3.5" /> Contact & Links
            </label>
            <input
              type="text"
              value={resumeData.contact}
              onChange={(e) => handleResumeFieldChange('contact', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <FileText className="h-3.5 w-3.5" /> Professional Summary
          </label>
          <textarea
            value={resumeData.summary}
            onChange={(e) => handleResumeFieldChange('summary', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet resize-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <Briefcase className="h-3.5 w-3.5" /> Work Experience (HTML format)
          </label>
          <textarea
            value={resumeData.experience}
            onChange={(e) => handleResumeFieldChange('experience', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <GraduationCap className="h-3.5 w-3.5" /> Education
            </label>
            <textarea
              value={resumeData.education}
              onChange={(e) => handleResumeFieldChange('education', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <Code className="h-3.5 w-3.5" /> Skills
            </label>
            <textarea
              value={resumeData.skills}
              onChange={(e) => handleResumeFieldChange('skills', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
          <Edit3 className="h-4 w-4 text-sunset-pink" />
          Edit Cover Letter Content
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={coverLetterData.name}
              onChange={(e) => handleCoverLetterFieldChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
              <Mail className="h-3.5 w-3.5" /> Contact Info
            </label>
            <input
              type="text"
              value={coverLetterData.contact}
              onChange={(e) => handleCoverLetterFieldChange('contact', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <FileText className="h-3.5 w-3.5" /> Cover Letter Body
          </label>
          <textarea
            value={coverLetterData.content}
            onChange={(e) => handleCoverLetterFieldChange('content', e.target.value)}
            rows={10}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-sunset-violet leading-relaxed"
          />
        </div>
      </div>
    );
  }
}
