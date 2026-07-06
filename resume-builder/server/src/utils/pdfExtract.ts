import pdf from 'pdf-parse';

/**
 * Extracts plain text from a PDF buffer.
 * @param pdfBuffer The file buffer of the uploaded PDF.
 * @returns The extracted plain text.
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is a valid PDF and contains indexable text.');
  }
}
