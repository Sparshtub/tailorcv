import { Router } from 'express';
import { generateTailoredContent } from '../utils/ai';

const router = Router();

router.post('/', async (req: any, res: any) => {
  try {
    const { resumeText, jobDescription, type } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Missing required fields: resumeText and jobDescription' });
    }

    if (type !== 'resume' && type !== 'cover-letter') {
      return res.status(400).json({ error: 'Invalid type. Must be either "resume" or "cover-letter".' });
    }

    const tailoredContent = await generateTailoredContent(resumeText, jobDescription, type);
    return res.json(tailoredContent);
  } catch (error: any) {
    console.error('Tailor route error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during tailoring.' });
  }
});

export default router;
