import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🔍 Début du Mapping V4 (Analyse Tailles + Vocabulaire)...');

    const backupPath = path.join(process.cwd(), 'products-backup-before-category-rebuild.json');
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Fichier de sauvegarde introuvable.');
        return;
    }
    const products = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const categories = await prisma.category.findMany({ include: { parent: true } });
    const aClasserCat = categories.find(c => c.slug === 'a-classer');

    const mappedProducts = products.map((p: any) => {
        let matchedSlug = null;
        let confidence = 'LOW';
        let foundRule = null;
        let probableDomain = 'Mode';

        const name = p.name || '';
        const desc = p.description || '';
        const oldCat = p.currentCategory || '';
        const searchText = `${name} ${desc} ${oldCat}`.toLowerCase();
        
        // --- 1. DETECTION GENRE (TEXTE + TAILLES) ---
        let isFemme = /bayan|femme|dame|lady|girl|fille|elbiseler|etek|caftan|abaya/.test(searchText);
        let isHomme = /erkek|homme|man|boy|garcon|costume|takim|takım/.test(searchText);

        // Analyse des tailles dans le texte (ex: "36-44" ou "38. 40. 42.")
        // Les tailles 36, 38, 40, 42, 44 sont typiquement féminines sur ce catalogue.
        const womanSizes = /\b(34|36|38|40|42|44)\b/.test(searchText);
        const bigSizes = /\b(52|54|56|58|60)\b/.test(searchText); // Souvent hommes ou grande taille femme, mais sur Sharufa souvent Hommes.
        
        if (womanSizes && !isHomme) isFemme = true;

        // --- 2. REGLES SPECIFIQUES ---
        
        // Jupes
        if (/jupe|etek/.test(searchText)) {
            matchedSlug = 'jupes-femmes';
            confidence = 'HIGH';
            foundRule = 'jupe/etek';
        }
        // Robes
        else if (/robe|elbise|caftan|abaya|tulum|combinaison/.test(searchText)) {
            matchedSlug = 'robes-femmes';
            confidence = 'HIGH';
            foundRule = 'robe/elbise';
        }
        // Sacs
        else if (/sac|çanta|handbag/.test(searchText)) {
            matchedSlug = 'sacs-femmes';
            confidence = 'HIGH';
            foundRule = 'sac';
        }
        // Ensembles / Suits
        else if (/takim|takım|suit|ensemble|tailleur|pantolon takim/.test(searchText)) {
            if (isHomme) { matchedSlug = 'costumes-hommes'; confidence = 'HIGH'; }
            else if (isFemme) { matchedSlug = 'robes-femmes'; confidence = 'HIGH'; }
            else { matchedSlug = 'mode-accessoires'; confidence = 'MEDIUM'; }
            foundRule = 'ensemble';
        }
        // Pantalons
        else if (/pantalon|pantolon|jean|denim|şort|short/.test(searchText)) {
            if (isHomme) { matchedSlug = 'pantalons-hommes'; confidence = 'HIGH'; }
            else if (isFemme) { matchedSlug = 'femmes'; confidence = 'MEDIUM'; }
            else { matchedSlug = 'mode-accessoires'; confidence = 'MEDIUM'; }
            foundRule = 'pantalon';
        }
        // T-shirts
        else if (/t-shirt|tshirt|polo|top/.test(searchText)) {
            if (isHomme) { matchedSlug = 'tshirts-hommes'; confidence = 'HIGH'; }
            else if (isFemme) { matchedSlug = 'tshirts-femmes'; confidence = 'HIGH'; }
            else { matchedSlug = 'mode-accessoires'; confidence = 'MEDIUM'; }
            foundRule = 'tshirt';
        }

        // --- 3. AUTRES DOMAINES ---
        if (confidence === 'LOW') {
            if (/phone|iphone|samsung|pixel/.test(searchText)) { matchedSlug = 'smartphones-tablettes'; confidence = 'HIGH'; probableDomain = 'Électronique'; }
            else if (/riz|pates|huile|épice/.test(searchText)) { matchedSlug = 'epicerie-salee'; confidence = 'HIGH'; probableDomain = 'Alimentaire'; }
            else if (oldCat === 'Mode' || searchText.includes('mode')) { matchedSlug = 'mode-accessoires'; confidence = 'MEDIUM'; }
        }

        // Final Fallback
        if (confidence === 'LOW') {
            matchedSlug = 'a-classer';
            confidence = 'LOW';
        }

        const targetCategory = categories.find(c => c.slug === matchedSlug) || aClasserCat;

        return {
            ...p,
            newCategoryId: targetCategory?.id || null,
            categoryPath: targetCategory ? 
                (targetCategory.parent ? `${targetCategory.parent.name} > ${targetCategory.name}` : targetCategory.name) 
                : 'Inconnu',
            confidence: confidence,
            matchedKeyword: foundRule,
            probableDomain: probableDomain
        };
    });

    const stats = {
        total: mappedProducts.length,
        high: mappedProducts.filter((p: any) => p.confidence === 'HIGH').length,
        medium: mappedProducts.filter((p: any) => p.confidence === 'MEDIUM').length,
        low: mappedProducts.filter((p: any) => p.confidence === 'LOW').length
    };

    fs.writeFileSync('products-mapped-v2.json', JSON.stringify(mappedProducts, null, 2));

    console.log('\n📊 Statistiques V4 (Tailles + Genres) :');
    console.log(`Total Produits : ${stats.total}`);
    console.log(`✅ HIGH   : ${stats.high} (${Math.round(stats.high/stats.total * 100)}%)`);
    console.log(`🫸 MEDIUM : ${stats.medium} (${Math.round(stats.medium/stats.total * 100)}%)`);
    console.log(`❌ LOW    : ${stats.low} (${Math.round(stats.low/stats.total * 100)}%)`);
}

main().catch(console.error).finally(() => { pool.end(); });
