const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to HD resolution (16:9)
        const viewportWidth = 1920;
        const viewportHeight = 1080;
        
        await page.setViewport({
            width: viewportWidth,
            height: viewportHeight,
            deviceScaleFactor: 1.5 // Higher quality capture
        });
        
        // Load the HTML file (now deck.html with access token to bypass email wall)
        const htmlPath = `file://${path.resolve(__dirname, 'deck.html')}?access=pdf-generator`;
        console.log('Loading HTML from:', htmlPath);
        await page.goto(htmlPath, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for initial load and fonts
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get slide count and hide PDF button
        const slideCount = await page.evaluate(() => {
            // Hide the PDF button if it exists (both button and anchor elements)
            const buttons = document.querySelectorAll('button, a');
            buttons.forEach(btn => {
                if (btn.textContent.includes('Generate PDF') || btn.textContent.includes('Download PDF')) {
                    btn.style.display = 'none';
                }
            });
            
            // Hide scroll hint if exists
            const scrollHint = document.querySelector('.scroll-hint');
            if (scrollHint) {
                scrollHint.style.display = 'none';
            }
            
            return document.querySelectorAll('.slide').length;
        });
        
        console.log(`Found ${slideCount} slides`);
        
        // Collect screenshots
        const screenshots = [];
        
        for (let i = 0; i < slideCount; i++) {
            console.log(`Capturing slide ${i + 1}/${slideCount}...`);
            
            // Scroll to the exact slide position
            await page.evaluate((slideIndex) => {
                const container = document.querySelector('.deck-container');
                const slideHeight = window.innerHeight;
                
                // Scroll to exact slide position
                container.scrollTo({
                    top: slideIndex * slideHeight,
                    behavior: 'instant'
                });
            }, i);
            
            // Wait for scroll to complete and animations to settle
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Take screenshot of current viewport
            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: false, // Only capture viewport
                captureBeyondViewport: false
            });
            
            screenshots.push(screenshot);
        }
        
        console.log('Creating PDF from screenshots...');
        
        // Create HTML page with all screenshots for PDF generation
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page { 
                    size: 1920px 1080px;
                    margin: 0;
                }
                body { 
                    margin: 0; 
                    padding: 0;
                    background: white;
                }
                .page {
                    width: 1920px;
                    height: 1080px;
                    page-break-after: always;
                    page-break-inside: avoid;
                    position: relative;
                    display: block;
                    margin: 0;
                    padding: 0;
                }
                .page:last-child {
                    page-break-after: auto;
                }
                img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            ${screenshots.map((screenshot, index) => 
                `<div class="page"><img src="data:image/png;base64,${screenshot.toString('base64')}" alt="Slide ${index + 1}"/></div>`
            ).join('')}
        </body>
        </html>`;
        
        // Create new page with screenshots
        const pdfPage = await browser.newPage();
        await pdfPage.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Generate PDF from the screenshots page
        await pdfPage.pdf({
            path: 'QStarLabs_Strategic_Deck_2025.pdf',
            width: '1920px',
            height: '1080px',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            preferCSSPageSize: true
        });
        
        console.log('PDF generated successfully: QStarLabs_Strategic_Deck_2025.pdf');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run the generator
generatePDF().catch(console.error);