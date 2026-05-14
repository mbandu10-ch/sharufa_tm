
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const targets = [
  { slug: 'industrie-v3', name: 'un tracteur agricole moderne et puissant dans un champ ou sur fond neutre' },
  { slug: 'cuisine-v2', name: 'un ensemble complet d\'ustensiles de cuisine (spatules, fouets, louches) en inox et bois' },
  { slug: 'voitures-v2', name: 'une voiture de luxe moderne et une moto sportive ensemble dans un garage ou showroom' }
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
