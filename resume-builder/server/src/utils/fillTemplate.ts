import { prismTemplate } from '../templates/prism';
import { classicTemplate } from '../templates/classic';
import { minimalTemplate } from '../templates/minimal';

interface TemplateData {
  name: string;
  contact: string;
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
  content?: string; // Cover letter body
}

interface CustomStyles {
  accentColor: string;
  fontFamily: string;
}

/**
 * Merges raw data and style preferences into the selected template layout.
 */
export function fillTemplate(
  templateId: 'prism' | 'classic' | 'minimal' | string,
  data: TemplateData,
  styles: CustomStyles,
  type: 'resume' | 'cover-letter',
  customHtmlTemplate?: string // Support for custom templates (stretch goal)
): string {
  // Select the raw template HTML string
  let html = '';
  if (customHtmlTemplate) {
    html = customHtmlTemplate;
  } else {
    switch (templateId) {
      case 'prism':
        html = prismTemplate;
        break;
      case 'classic':
        html = classicTemplate;
        break;
      case 'minimal':
      default:
        html = minimalTemplate;
        break;
    }
  }

  // Set default styles if missing
  const accent = styles.accentColor || '#ed2c5f';
  const font = styles.fontFamily || 'Inter';

  // Build the sections depending on the type
  let skillsSection = '';
  let resumeMainSection = '';
  let coverLetterMainSection = '';

  if (type === 'resume') {
    // Skills section (sidebar for Prism, inline for others)
    if (data.skills) {
      if (templateId === 'prism') {
        skillsSection = `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills-list">${data.skills}</div>
          </div>
        `;
      } else if (templateId === 'classic') {
        skillsSection = `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills-list">${data.skills}</div>
          </div>
        `;
      } else { // minimal
        skillsSection = `
          <div class="grid-layout">
            <h2>Skills</h2>
            <div class="section-content">
              <div class="skills-list">${data.skills}</div>
            </div>
          </div>
        `;
      }
    }

    // Resume Main body sections
    if (templateId === 'prism') {
      resumeMainSection = `
        <div class="section">
          <h2>Professional Summary</h2>
          <div class="summary-text">${data.summary || ''}</div>
        </div>
        <div class="section">
          <h2>Work Experience</h2>
          <div class="experience-list">${data.experience || ''}</div>
        </div>
        <div class="section">
          <h2>Education</h2>
          <div class="education-list">${data.education || ''}</div>
        </div>
      `;
    } else if (templateId === 'classic') {
      resumeMainSection = `
        <div class="section">
          <h2>Professional Summary</h2>
          <div class="summary-text">${data.summary || ''}</div>
        </div>
        <div class="section">
          <h2>Work Experience</h2>
          <div class="experience-list">${data.experience || ''}</div>
        </div>
        <div class="section">
          <h2>Education</h2>
          <div class="education-list">${data.education || ''}</div>
        </div>
        ${skillsSection}
      `;
    } else { // minimal
      resumeMainSection = `
        <div class="grid-layout">
          <h2>Summary</h2>
          <div class="section-content">
            <div class="summary-text">${data.summary || ''}</div>
          </div>
        </div>
        <div class="grid-layout">
          <h2>Experience</h2>
          <div class="section-content">
            <div class="experience-list">${data.experience || ''}</div>
          </div>
        </div>
        <div class="grid-layout">
          <h2>Education</h2>
          <div class="section-content">
            <div class="education-list">${data.education || ''}</div>
          </div>
        </div>
        ${skillsSection}
      `;
    }
  } else {
    // Cover Letter Main body section
    if (templateId === 'prism') {
      coverLetterMainSection = `
        <div class="section">
          <h2>Cover Letter</h2>
          <div class="content-text">${data.content || ''}</div>
        </div>
      `;
    } else if (templateId === 'classic') {
      coverLetterMainSection = `
        <div class="section">
          <h2>Cover Letter</h2>
          <div class="content-text">${data.content || ''}</div>
        </div>
      `;
    } else { // minimal
      coverLetterMainSection = `
        <div class="grid-layout">
          <h2>Letter</h2>
          <div class="section-content">
            <div class="content-text">${data.content || ''}</div>
          </div>
        </div>
      `;
    }
  }

  // Replace all layout placeholders
  let rendered = html
    .replace(/{name}/g, data.name || '')
    .replace(/{contact}/g, data.contact || '')
    .replace(/{accentColor}/g, accent)
    .replace(/{fontFamily}/g, font)
    .replace(/{skillsSection}/g, skillsSection)
    .replace(/{resumeMainSection}/g, resumeMainSection)
    .replace(/{coverLetterMainSection}/g, coverLetterMainSection);

  // If using a custom user template (stretch feature), also support simple general placeholder mapping
  if (customHtmlTemplate) {
    rendered = rendered
      .replace(/{summary}/g, data.summary || '')
      .replace(/{experience}/g, data.experience || '')
      .replace(/{education}/g, data.education || '')
      .replace(/{skills}/g, data.skills || '')
      .replace(/{content}/g, data.content || '');
  }

  return rendered;
}
