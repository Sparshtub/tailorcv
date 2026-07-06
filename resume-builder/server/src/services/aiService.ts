import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not defined in the environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Tailor resume text or generate a cover letter using Gemini AI.
 * @param resumeText The raw extracted text of the user's resume.
 * @param jobDescription The text of the target job description.
 * @param type Either 'resume' or 'cover_letter'.
 * @returns The AI generated content in Markdown format.
 */
export async function generateTailoredContent(
  resumeText: string,
  jobDescription: string,
  type: 'resume' | 'cover_letter'
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured on the server.');
  }

  // Use gemini-2.5-flash as the default model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let prompt = '';

  if (type === 'resume') {
    prompt = `
You are an expert career coach and resume writer. Your task is to rewrite the provided resume to tailor it specifically to the given job description.

Follow these strict rules:
1. **Preserve Structure**: Keep the original sections, layout structure, job titles, companies, dates, and education. Do NOT omit standard header/contact info or education sections.
2. **Tailor Experience Bullets**: Rewrite the bullet points for work experience. Rephrase them to highlight the skills, tools, and methodologies requested in the job description that overlap with the candidate's experience. Use strong action verbs.
3. **No Fabrications**: Do NOT invent projects, skills, certifications, or jobs the candidate does not have. Only emphasize and highlight relevance.
4. **Professional Tone**: Use professional, impact-driven language. Mention metrics and achievements if they exist.
5. **Output Format**: Return the complete rewritten resume in clean, well-formatted Markdown.

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Tailored Resume:
`;
  } else {
    prompt = `
You are an expert career coach and resume writer. Your task is to draft a highly compelling cover letter for the candidate based on their resume and the job description.

Follow these rules:
1. **Highlight Fit**: Align the candidate's skills and key achievements from their resume with the requirements of the job description.
2. **Professional Structure**: Use standard business letter format (Date, Hiring Manager/Company placeholders, Salutation, Intro, Body Paragraphs, Call to Action, Professional Sign-off).
3. **Tone**: Keep it warm, enthusiastic, professional, and persuasive.
4. **Conciseness**: Keep it within 300 to 450 words.
5. **Output Format**: Return the cover letter in clean, well-formatted Markdown.

Resume Text:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Cover Letter:
`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
