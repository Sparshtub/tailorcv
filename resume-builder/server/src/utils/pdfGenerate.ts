import puppeteer from 'puppeteer';

/**
 * Renders an HTML string into a high-quality PDF buffer using Puppeteer.
 * @param htmlContent The fully rendered HTML template string.
 * @returns A Promise resolving to the PDF Buffer.
 */
export async function generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set the page content and wait for fonts/images to load
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0' 
    });
    
    // Generate PDF with A4 dimensions and print background graphics
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm'
      }
    });
    
    await browser.close();
    return Buffer.from(pdfUint8Array);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Error during Puppeteer PDF generation:', error);
    throw new Error('Failed to generate PDF. Check template structure and CSS styling.');
  }
}
