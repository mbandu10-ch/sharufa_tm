
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const targets = [
  { slug: 'electricite-plomberie', name: 'un kit de matériel électrique (câbles, disjoncteur) et des outils de plomberie professionnels' },
  { slug: 'entretien-maison', name: 'un ensemble de produits ménagers (pulvérisateurs, éponges, brosses) sur un plan de travail propre' },
  { slug: 'hygiene-papier', name: 'des rouleaux de papier toilette de luxe et des boîtes de mouchoirs en papier blancs' },
  { slug: 'bebe-habille', name: 'un adorable bébé souriant habillé avec de beaux vêtements modernes et colorés' }
];

async function generateSpecifics() {
  for (const item of targets) {
    console.log(`[START] Generating specific image for ${item.slug}...`);
    try {
      const prompt = `Professional e-commerce product photography of ${item.name}. Minimalist style, isolated on a clean light gray background, studio lighting, high quality, aesthetically pleasing style.`;
      
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const b64Data = response.data[0].b64_json;
      if (b64Data) {
        const filepath = path.join(process.cwd(), 'apps/web/public/categories', `${item.slug}.jpg`);
        fs.writeFileSync(filepath, Buffer.from(b64Data, 'base64'));
        console.log(`[SUCCESS] Saved image for ${item.slug}`);
      }
    } catch (err: any) {
      console.error(`[ERROR] Failed for ${item.slug}:`, err.message);
    }
  }
}

generateSpecifics();
