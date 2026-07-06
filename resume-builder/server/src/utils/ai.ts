import { GoogleGenerativeAI } from '@google/generative-ai';

export interface StructuredResume {
  name: string;
  contact: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export interface StructuredCoverLetter {
  name: string;
  contact: string;
  content: string;
}

export async function generateTailoredContent(
  resumeText: string,
  jobDescription: string,
  type: 'resume' | 'cover-letter'
): Promise<StructuredResume | StructuredCoverLetter> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your server/.env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  if (type === 'resume') {
    const prompt = `
You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist.
Your task is to review the candidate's resume text and tailor it to match the provided Job Description.

Ensure that you:
1. Re-write the summary to align with the target job role.
2. Edit experience bullet points to highlight achievements, metrics, and key skills relevant to the Job Description while remaining truthful to the candidate's actual history (do NOT make up fake companies, dates, or titles).
3. Format the 'experience', 'education', and 'skills' fields as clean HTML string snippets (using <ul>, <li>, etc.) or simple text so that it can be cleanly rendered by HTML templates.
4. Extract the candidate's name and contact information accurately.

Provide the response in the following JSON schema:
{
  "name": "Candidate's full name",
  "contact": "Contact details (email, phone, location, LinkedIn/GitHub links in a clean HTML structure or text)",
  "summary": "Tailored professional summary",
  "experience": "HTML list (<ul>/<li>) of professional experience with tailored bullet points",
  "education": "HTML list (<ul>/<li>) of education history",
  "skills": "HTML snippet or formatted text of tailored skills"
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text) as StructuredResume;
  } else {
    const prompt = `
You are an expert career consultant and resume writer.
Your task is to write a highly professional, compelling cover letter for the candidate based on their resume and the target Job Description.

The cover letter should:
1. Be 3-4 paragraphs long, structured logically (opening hook, experience highlights matching the job, and closing call to action).
2. Show high enthusiasm for the role and company.
3. Be written in a formal, professional tone.
4. Separate paragraphs with HTML line breaks (<br/>) or paragraph tags (<p>).

Provide the response in the following JSON schema:
{
  "name": "Candidate's full name",
  "contact": "Contact details (email, phone, location, links)",
  "content": "Full body text of the cover letter with HTML paragraphs (<p> or <br/>)"
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return JSON.parse(text) as StructuredCoverLetter;
  }
}
