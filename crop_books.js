const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = 'C:/Users/USER/.gemini/antigravity-ide/brain/c2788c3d-a7a5-44fc-bece-fa2c9c328878/media__1781702459522.jpg';
const outputDir = path.join(__dirname, 'public', 'images', 'books');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function cropBooks() {
  const metadata = await sharp(inputImagePath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  const colWidth = Math.floor(width / 5);
  const rowHeight = Math.floor(height / 2);
  
  // 4% padding to trim the shelf edges
  const padX = Math.floor(colWidth * 0.04);
  const padY = Math.floor(rowHeight * 0.04);
  const cropW = colWidth - 2 * padX;
  const cropH = rowHeight - 2 * padY;

  let bookIndex = 1;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 5; col++) {
      const left = col * colWidth + padX;
      const top = row * rowHeight + padY;
      
      const outputPath = path.join(outputDir, `dev_perso_${bookIndex}.jpg`);
      await sharp(inputImagePath)
        .extract({ left, top, width: cropW, height: cropH })
        .toFile(outputPath);
      
      console.log(`Saved ${outputPath}`);
      bookIndex++;
    }
  }
}

cropBooks().catch(console.error);
