import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI();

async function runDiagnostic() {
  console.log("🔍 [DIAGNOSTIC] Fetching available models...");
  try {
    const response = await client.models.list();
    const allModels = response.data.map(m => m.id);
    
    // Filtre et affiche les modèles liés aux images
    const imageModels = allModels.filter(id => 
      id.includes('image') || id.includes('gpt-image') || id.includes('dall')
    );
    
    console.log("✅ [DIAGNOSTIC] Image-related models available on this key:");
    if (imageModels.length === 0) {
      console.log("   ❌ Aucun modèle d'image trouvé.");
    } else {
      imageModels.forEach(m => console.log(`   - ${m}`));
    }
  } catch (error: any) {
    console.error("❌ [DIAGNOSTIC ERROR]:", error.message);
  }
}

async function testGeneration() {
  console.log("\n🎨 [TEST] Generating 1 single image with model 'gpt-image-1'...");
  try {
    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: "Luxury Campus Horizon flyer. Minimalist style, isolated on a clean light gray background, studio lighting, high quality, aesthetically pleasing.",
      n: 1,
      size: "1024x1024"
    });

    if (result.data[0].b64_json) {
      console.log("✅ [TEST SUCCESS] Image generated successfully (Base64 received)!");
      console.log("   Taille des données Base64:", result.data[0].b64_json.length, "caractères.");
      
      // Sauvegarde du test unitaire
      const fs = require('fs');
      fs.writeFileSync('test-image.png', Buffer.from(result.data[0].b64_json, 'base64'));
      console.log("   Image de test sauvegardée sous 'test-image.png'");
    } else {
      console.log("❌ [TEST ERROR] Le modèle n'a pas retourné l'image attendue.");
      console.log(result.data[0])
    }
  } catch (error: any) {
    console.error("❌ [TEST ERROR] Exact failure reason:");
    console.error(error.message);
  }
}

async function main() {
  await runDiagnostic();
  await testGeneration();
}

main().catch(console.error);
