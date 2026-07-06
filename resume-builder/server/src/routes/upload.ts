import { Router } from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../utils/pdfExtract';

const router = Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // limit file size to 10MB
  }
});

router.post('/', upload.single('resume'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF resume.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file type. Only PDF files are allowed.' });
    }

    const text = await extractTextFromPDF(req.file.buffer);
    
    return res.json({ text });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during file upload and extraction.' });
  }
});

export default router;
