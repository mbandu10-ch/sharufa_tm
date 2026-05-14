import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();

// Exact mapping from MarketplaceMegaMenu.tsx
const CATEGORY_VISUALS: Record<string, string> = {
  'vetements-femme': 'Vêtements Mode Femme',
  'chaussures-femme': 'Chaussures Femme',
  'sacs-maroquinerie-femme': 'Sacs à main Femme',
  'bijoux-femme': 'Bijoux Femme',
  'beaute-cosmetiques-femme': 'Cosmétiques',
  'accessoires-femme': 'Accessoires Mode',
  'mariage-ceremonie-femme': 'Robe de Mariage',
  'sante-bien-etre-femme': 'Bien-être et Spa',
  'maternite-bebe-maman': 'Vêtements Maternité',
  'luxe-premium-femme': 'Sac de Luxe',

  'vetements-homme': 'Vêtements Mode Homme',
  'chaussures-homme': 'Chaussures Homme',
  'sacs-maroquinerie-homme': 'Sacoche Homme',
  'montres-bijoux-homme': 'Montre Homme',
  'grooming-soins-homme': 'Soins Barbe',
  'accessoires-homme': 'Lunettes de soleil Homme',
  'sport-fitness-homme': 'Vêtements de Sport',
  'business-executive-homme': 'Costume Business',
  'luxe-premium-homme': 'Accessoire Luxe Homme',
  'voyage-lifestyle-homme': 'Valise de Voyage',

  'vetements-enfant': 'Vêtements Enfant',
  'chaussures-enfant': 'Chaussures Enfant',
  'ecole-rentree-enfant': 'Sac à dos École',

  'accessoires': 'Accessoires Divers',
  'sacs-maroquinerie': 'Maroquinerie en cuir',
  'bijoux-montres': 'Bijoux et Montres',

  'electronique-legere': 'Électronique et Gadgets',
  'acc-tel': 'Accessoires Téléphone',
  'laptops': 'Ordinateur Portable',
  'casques': 'Casque Audio',

  'maison-deco': 'Décoration Maison',
  'mobilier': 'Mobilier Moderne',
  'cuisine': 'Ustensiles de Cuisine',

  'beaute': 'Produits de Beauté',
  
  'voitures': 'Voiture Moderne',
  'motos-scooters': 'Moto',
  'velos-mobilite': 'Vélo et Trottinette',
  'accessoires-auto': 'Accessoires Voiture',
  'pieces-auto': 'Pièces Détachées Auto',
  'entretien-auto': 'Produits Entretien Auto',

  'outillage': 'Outils de Bricolage',
  'construction': 'Matériaux de Construction',
  'technique': 'Matériel Électrique',

  'alimentaire': 'Alimentation et Épicerie',
  'boissons': 'Boissons et Jus',
  'hygiene': 'Produits Hygiène',

  'vetements-bebe-0-24': 'Vêtements Bébé',
  'puericulture-bebe': 'Article Puériculture',
  'alimentation-bebe': 'Biberon et Alimentation Bébé',
  'soins-hygiene-bebe': 'Soins Bébé',
  'sante-securite-bebe': 'Sécurité Bébé',
  'jouets-eveil-bebe': 'Jouets Éveil Bébé',
  'chambre-bebe': 'Chambre de Bébé',
  'maman-maternite-bebe': 'Produits Maternité',

  'industrie': 'Équipement Industriel',
  'securite': 'Équipement Sécurité EPI',
  'pro': 'Fournitures Professionnelles',
};

const downloadImage = (url: string, filepath: string) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
            }
        });
    });
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateImage = async (slug: string, name: string) => {
  const filepath = path.join(__dirname, '../apps/web/public/categories', `${slug}.jpg`);
  if (fs.existsSync(filepath)) {
      console.log(`[SKIP] Image already exists for ${slug}`);
      return;
  }
  
  console.log(`[START] Generating image for ${slug} (${name})`);
  try {
    const prompt = `Professional e-commerce product photography of "${name}". Minimalist style, isolated on a clean light gray background, studio lighting, high quality, aesthetically pleasing, SHEIN or Apple catalogue style.`
    
    // Utiliser le nouveau modèle gpt-image-1
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const b64Data = response.data[0].b64_json;
    if (b64Data) {
        fs.writeFileSync(filepath, Buffer.from(b64Data, 'base64'));
        console.log(`[SUCCESS] Saved image for ${slug}`);
    } else {
        console.error(`[ERROR] No b64_json data for ${slug}`);
    }
  } catch (err: any) {
    console.error(`[ERROR] Failed to generate for ${slug}:`, err.message);
  }
}

async function main() {
    const dir = path.join(__dirname, '../apps/web/public/categories');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const entries = Object.entries(CATEGORY_VISUALS);
    
    // Génération séquentielle pour éviter les Rate Limits de l'API OpenAI
    for (let i = 0; i < entries.length; i++) {
        const [slug, name] = entries[i];
        await generateImage(slug, name);
        // Pause de 1 seconde entre chaque requête pour éviter les limites de taux (Tier 1 a ~5 req/min, Tier 3+ est safe)
        // Mais pour être sûr on met 2 secondes
        await delay(2000);
    }
    
    console.log("All category images generated successfully!");
}

main().catch(console.error);
