import { Router } from 'express';
import { fillTemplate } from '../utils/fillTemplate';
import { generatePDFFromHTML } from '../utils/pdfGenerate';

const router = Router();

router.post('/', async (req: any, res: any) => {
  try {
    const { templateId, data, styles, type, customHtmlTemplate } = req.body;

    if (!data || !data.name) {
      return res.status(400).json({ error: 'Missing candidate data. A name is required at minimum.' });
    }

    if (type !== 'resume' && type !== 'cover-letter') {
      return res.status(400).json({ error: 'Invalid type. Must be either "resume" or "cover-letter".' });
    }

    // Fill structural template placeholders with user content
    const htmlContent = fillTemplate(
      templateId || 'minimal',
      data,
      styles || { accentColor: '#ed2c5f', fontFamily: 'Inter' },
      type,
      customHtmlTemplate
    );

    // Render the final HTML to a PDF document buffer via Puppeteer
    const pdfBuffer = await generatePDFFromHTML(htmlContent);

    // Set headers to trigger a file download in the user's browser
    const fileName = `${data.name.replace(/\s+/g, '_')}_${type}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Export route error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred during PDF generation.' });
  }
});

export default router;
