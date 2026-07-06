import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { createRequire } from 'module';
import { generateTailoredContent } from './services/aiService.js';
import { generatePdfBuffer } from './services/pdfService.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Resume Builder API' });
});

// POST /api/upload - handles PDF file upload and returns extracted text
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Parse the PDF buffer using PDFParse class
    const parser = new PDFParse({ data: req.file.buffer });
    const data = await parser.getText();
    
    return res.json({ text: data.text });
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    return res.status(500).json({ error: 'Failed to parse PDF', details: error.message });
  }
});

// POST /api/tailor - tailors the resume or cover letter using Gemini AI
app.post('/api/tailor', async (req, res) => {
  try {
    const { resumeText, jobDescription, type = 'resume' } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required' });
    }

    if (type !== 'resume' && type !== 'cover_letter') {
      return res.status(400).json({ error: "type must be either 'resume' or 'cover_letter'" });
    }

    const tailoredContent = await generateTailoredContent(resumeText, jobDescription, type);

    return res.json({ content: tailoredContent });
  } catch (error: any) {
    console.error('Error in tailoring AI response:', error);
    return res.status(500).json({ error: 'AI tailoring failed', details: error.message });
  }
});

// POST /api/export - exports markdown text to a downloadable PDF file
app.post('/api/export', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required to export PDF' });
    }

    const pdfBuffer = await generatePdfBuffer(text);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tailored_document.pdf');
    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'PDF generation failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
