import puppeteer from 'puppeteer';

export const generatePdfFromHtml = async (html: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    
    // Wait for all images to fully load
    await page.evaluate(() => {
      const selectors = Array.from(document.querySelectorAll('img'));
      return Promise.all(selectors.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      }));
    });
    
    // Generate PDF with A4 format and print background
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};