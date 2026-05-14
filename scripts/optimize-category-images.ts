
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const categoriesDir = path.join(process.cwd(), 'apps/web/public/categories');

async function optimizeImages() {
  const files = fs.readdirSync(categoriesDir);
  const imageFiles = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg'));

  console.log(`🚀 Optimisation de ${imageFiles.length} images...`);

  for (const file of imageFiles) {
    const inputPath = path.join(categoriesDir, file);
    const fileName = path.parse(file).name;
    const outputPath = path.join(categoriesDir, `${fileName}.webp`);

    try {
      await sharp(inputPath)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const originalStats = fs.statSync(inputPath);
      console.log(`✅ Optimized: ${file} (${(originalStats.size / 1024).toFixed(0)}KB -> ${(stats.size / 1024).toFixed(0)}KB)`);
      
      // Optionnel: supprimer l'original pour gagner de la place dans le repo
      // fs.unlinkSync(inputPath);
    } catch (err) {
      console.error(`❌ Error optimizing ${file}:`, err);
    }
  }

  console.log('✨ Toutes les images ont été optimisées en .webp !');
}

optimizeImages();
