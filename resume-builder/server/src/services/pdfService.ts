import puppeteer from 'puppeteer';
import { marked } from 'marked';

/**
 * Generates a PDF buffer from markdown text using Puppeteer.
 * @param markdownText The tailored resume or cover letter text in Markdown format.
 * @returns A Promise resolving to a Buffer of the generated PDF.
 */
export async function generatePdfBuffer(markdownText: string): Promise<Buffer> {
  // Convert markdown to HTML
  const rawHtml = await marked.parse(markdownText);

  // Wrap in a beautifully styled HTML template for professional printing
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4;
            margin: 0.5in;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #2d3748;
            margin: 0;
            padding: 0;
          }
          
          /* Headings */
          h1 {
            font-size: 22pt;
            margin-top: 0;
            margin-bottom: 5px;
            color: #1a202c;
            text-align: center;
            font-weight: 700;
          }
          h2 {
            font-size: 12pt;
            border-bottom: 1.5px solid #cbd5e0;
            padding-bottom: 2px;
            margin-top: 20px;
            margin-bottom: 8px;
            color: #2b6cb0;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 600;
          }
          h3 {
            font-size: 11pt;
            margin-top: 10px;
            margin-bottom: 4px;
            color: #1a202c;
            font-weight: 600;
          }
          
          /* Paragraphs and Lists */
          p {
            margin-top: 0;
            margin-bottom: 8px;
            text-align: justify;
          }
          ul {
            margin-top: 0;
            margin-bottom: 8px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 3px;
          }
          
          /* Strong/Bold text */
          strong {
            color: #1a202c;
          }
          
          /* Links */
          a {
            color: #2b6cb0;
            text-decoration: none;
          }

          /* General layout utils */
          .contact-center {
            text-align: center;
            font-size: 9.5pt;
            color: #4a5568;
            margin-bottom: 20px;
          }

          /* Ensure sections do not get awkward page breaks */
          h2, h3 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .experience-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        ${rawHtml}
      </body>
    </html>
  `;

  // Launch a headless browser instance
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Load our compiled HTML
    await page.setContent(styledHtml, { waitUntil: 'domcontentloaded' });
    
    // Generate PDF binary
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    // Make sure we always close the browser
    await browser.close();
  }
}
