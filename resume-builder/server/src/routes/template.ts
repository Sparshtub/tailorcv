import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sanitizeHtml from 'sanitize-html';

const router = Router();

router.post('/generate', async (req: any, res: any) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Please provide a description of the design you want.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
You are an expert web designer and UI/UX developer.
Create a visually stunning, single-page resume and cover letter HTML/CSS template based on the following user request:

Description: "${description}"

Requirements:
1. Return the result in a JSON structure containing a single key "html":
{
  "html": "full HTML string here"
}
2. The HTML string must be a complete HTML document including <head>, <style>, and <body> tags. Do NOT use external images or fonts, except standard Google Web Fonts (if you import them via @import in the CSS).
3. The layout must look extremely modern, professional, and align with the user's design style request. Use HSL or hex color palettes, elegant padding, rounded borders, clean dividers, and smooth typography.
4. You MUST include these placeholders EXACTLY where they belong in the layout (do NOT replace them with mock text):
   - {name} : The candidate's name (typically in a large header)
   - {contact} : The contact information block
   - {skillsSection} : The sidebar or grid section containing the candidate's skills list
   - {resumeMainSection} : The main section showing summary, work experience, and education
   - {coverLetterMainSection} : The section showing the body text for cover letters
5. The placeholders will be replaced dynamically by the backend, so make sure they are styled appropriately.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();
    const data = JSON.parse(jsonText);

    if (!data.html) {
      return res.status(500).json({ error: 'AI failed to generate a valid HTML template.' });
    }

    const rawHtml = data.html;

    // Validate that the required placeholders are present
    const hasName = rawHtml.includes('{name}');
    const hasContact = rawHtml.includes('{contact}');

    if (!hasName || !hasContact) {
      return res.status(422).json({
        error: 'Generated template is invalid: missing required placeholders ({name} and {contact}). Please refine your description.'
      });
    }

    // Sanitize the generated HTML to ensure security
    const sanitizedHtml = sanitizeHtml(rawHtml, {
      // Allow style tags and common semantic elements
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'style', 'html', 'head', 'body', 'meta', 'title', 'span', 'div', 'section', 'header', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['style', 'class', 'id']
      },
      // Allow styling properties (margins, colors, fonts, layouts, flexbox, grid, etc.)
      allowedStyles: {
        '*': {
          '*': [/.*/] // Allow any styling property for design flexibility
        }
      }
    });

    return res.json({ html: sanitizedHtml });
  } catch (error: any) {
    console.error('Template generation error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during template generation.' });
  }
});

export default router;
