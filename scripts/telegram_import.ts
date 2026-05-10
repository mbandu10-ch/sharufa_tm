import * as fs from 'node:fs';
import * as path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config();

const DRY_RUN = false; 
const MARGIN = 0.17; 
const FIX_MODE = true; // Set to true to fix existing products instead of importing new ones

const TRANSLATIONS: Record<string, string> = {
    "pantolon takim": "Ensemble pantalon",
    "etek takim": "Ensemble jupe",
    "pantolon": "Pantalon",
    "takim": "Ensemble",
    "elbise": "Robe",
    "tunik": "Tunique",
    "etek": "Jupe",
    "kot": "Jeans",
    "ceket": "Veste",
    "gömlek": "Chemise",
    "kaban": "Manteau",
    "mont": "Blouson",
    "triko": "Maille",
    "ayakkabı": "Chaussures",
    "çanta": "Sac",
    "3’lu": "Ensemble 3 pièces",
    "3-lü": "Ensemble 3 pièces",
    "3'lü": "Ensemble 3 pièces",
    "3’lü": "Ensemble 3 pièces",
    "pamuk kumaş": "Tissu coton",
    "bedenler": "Tailles",
    "fotograf": "Photo",
    "üzerinde": "sur",
    "belirtilmiştir": "indiqué",
    "ve": "et",
    "jeans": "Jeans",
    "elbie": "Robe",
    "elbisi": "Robe"
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TelegramMessage {
    id: number;
    type: string;
    date: string;
    text: any;
    photo?: string;
    media_group_id?: string;
}

interface ProductGroup {
    productName: string;
    priceStr: string;
    sizes: string[];
    photos: string[];
}

async function main() {
    if (FIX_MODE) {
        await fixExistingProducts();
        return;
    }
    console.log("🚀 Starting import process...");
    console.log("🚀 Starting import process...");
    const exportPath = path.join(process.cwd(), 'Telegram Desktop', 'ChatExport_2026-04-02', 'result.json');
    const mediaPath = path.join(process.cwd(), 'Telegram Desktop', 'ChatExport_2026-04-02');

    if (!fs.existsSync(exportPath)) {
        console.error("❌ Export file not found at:", exportPath);
        return;
    }

    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    const messages: TelegramMessage[] = data.messages;

    let adminId: string = "";
    let shopId: string = "";
    let categoryId: string = "";

    if (!DRY_RUN) {
        // 1. Find Admin
        console.log("🔍 Looking for Admin profile...");
        const { data: admin, error: adminErr } = await supabase.from('Profile').select('id').eq('role', 'ADMIN').limit(1).single();
        
        if (admin) {
            adminId = admin.id;
        } else {
            const { data: anyUser } = await supabase.from('Profile').select('id').limit(1).single();
            if (anyUser) {
                adminId = anyUser.id;
                console.log(`⚠️ No ADMIN found, using profile: ${adminId}`);
            } else {
                throw new Error("No profiles found in database.");
            }
        }

        // 2. Find or Create Shop
        let { data: shop } = await supabase.from('Shop').select('id').eq('name', 'Sharufa Store').single();
        if (!shop) {
            console.log("🏪 Creating Sharufa Store...");
            const now = new Date().toISOString();
            const { data: newShop, error: shopErr } = await supabase.from('Shop').insert({
                id: randomUUID(),
                name: 'Sharufa Store',
                slug: 'sharufa-store',
                ownerId: adminId,
                description: 'Official Sharufa Store',
                createdAt: now,
                updatedAt: now
            }).select().single();
            if (shopErr) throw new Error(`Shop creation failed: ${shopErr.message}`);
            shopId = newShop.id;
        } else {
            shopId = shop.id;
        }

        // 3. Find or Create Category
        let { data: category } = await supabase.from('Category').select('id').eq('name', 'Mode').single();
        if (!category) {
            console.log("📁 Creating Category: Mode...");
            const now = new Date().toISOString();
            const { data: newCat, error: catErr } = await supabase.from('Category').insert({
                id: randomUUID(),
                name: 'Mode',
                slug: 'mode',
                createdAt: now,
                updatedAt: now
            }).select().single();
            if (catErr) throw new Error(`Category creation failed: ${catErr.message}`);
            categoryId = newCat.id;
        } else {
            categoryId = category.id;
        }

        if (!shopId || !categoryId) {
            throw new Error(`Failed to initialize Shop (${shopId}) or Category (${categoryId})`);
        }
        console.log(`✅ IDs Initialized: Shop=${shopId}, Category=${categoryId}`);

        // 4. Storage Bucket
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'product-assets');
        if (!bucketExists) {
            console.log("➕ Creating product-assets bucket...");
            await supabase.storage.createBucket('product-assets', { public: true });
        }
    }

    const productGroups: ProductGroup[] = [];
    let currentGroup: ProductGroup | null = null;

    for (const msg of messages) {
        if (msg.type !== 'message') continue;
        const text = extractText(msg.text);
        
        if (text.includes('$') && (text.includes('Size') || text.includes('🔥') || /\d+/.test(text))) {
            if (currentGroup) productGroups.push(currentGroup);
            const parsed = parseProductText(text);
            currentGroup = {
                productName: parsed.name,
                priceStr: parsed.price,
                sizes: parsed.sizes,
                photos: msg.photo ? [msg.photo] : []
            };
        } else if (msg.photo && currentGroup) {
            currentGroup.photos.push(msg.photo);
        }
    }
    if (currentGroup) productGroups.push(currentGroup);

    console.log(`📦 Found ${productGroups.length} potential products.`);

    for (let i = 0; i < productGroups.length; i++) {
        const group = productGroups[i];
        const rawPrice = parseFloat(group.priceStr.replace('$', ''));
        if (isNaN(rawPrice)) continue;

        const priceWithMarkup = parseFloat((rawPrice * (1 + MARGIN)).toFixed(2));

        if (!DRY_RUN) {
            try {
                const productId = randomUUID();
                const slug = `${group.productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${i}`;
                const now = new Date().toISOString();

                const productData = {
                    id: productId,
                    name: group.productName,
                    description: `Imported from Telegram. Tailles disponibles: ${group.sizes.join(', ')}`,
                    price: priceWithMarkup,
                    images: [],
                    shopId: shopId,
                    categoryId: categoryId,
                    slug: slug,
                    sizes: group.sizes,
                    stock: 100,
                    createdAt: now,
                    updatedAt: now
                };

                const { error: prodErr } = await supabase.from('Product').insert(productData);

                if (prodErr) {
                    console.error(`  ❌ [${i+1}] Failed: ${prodErr.message}`);
                    continue;
                }

                const uploadedUrls: string[] = [];
                for (const photoPath of group.photos) {
                    const fullPath = path.join(mediaPath, photoPath);
                    if (fs.existsSync(fullPath)) {
                        const fileName = `${productId}/${path.basename(fullPath)}`;
                        const fileBuffer = fs.readFileSync(fullPath);

                        const { error: uploadErr } = await supabase.storage
                            .from('product-assets')
                            .upload(fileName, fileBuffer, {
                                contentType: 'image/jpeg',
                                upsert: true
                            });

                        if (!uploadErr) {
                            const { data: urlData } = supabase.storage.from('product-assets').getPublicUrl(fileName);
                            uploadedUrls.push(urlData.publicUrl);
                        }
                    }
                }

                if (uploadedUrls.length > 0) {
                    await supabase.from('Product').update({ 
                        images: uploadedUrls, 
                        updatedAt: new Date().toISOString() 
                    }).eq('id', productId);
                }

                console.log(`  ✅ [${i+1}/${productGroups.length}] Imported: ${group.productName} (${priceWithMarkup}$)`);
            } catch (err: any) {
                console.error(`  ❌ [${i+1}] Unexpected:`, err.message);
            }
        } else {
            console.log(`🔍 [DRY RUN] ${group.productName} - ${priceWithMarkup}$`);
        }
    }
    console.log("🏁 Import process finished!");
}

async function fixExistingProducts() {
    console.log("🔧 Starting fix for existing products...");
    
    // 1. Find Shop
    let { data: shop } = await supabase.from('Shop').select('id').eq('name', 'Sharufa Store').single();
    if (!shop) {
        console.error("❌ Sharufa Store not found.");
        return;
    }
    const shopId = shop.id;

    // 2. Get all products for this shop - Batching if necessary but here we likely have < 1000
    const { data: products, error } = await supabase.from('Product').select('*').eq('shopId', shopId);
    
    if (error) {
        console.error("❌ Failed to fetch products:", error.message);
        return;
    }

    console.log(`🧐 Found ${products?.length || 0} products to clean up.`);

    for (const prod of products || []) {
        // Use description as it contains the raw text if we imported before
        const rawText = prod.description?.replace("Imported from Telegram. Tailles disponibles: ", "") || prod.name;
        const parsed = parseProductText(rawText);
        
        let newName = parsed.name;
        if (newName === "Produit Sharufa" && prod.name.length > 5) {
            // Fallback: If cleaning failed hard, keep old name but clean it minimally
            newName = translateAndClean(prod.name.split('.')[0]);
        }

        if (DRY_RUN) {
            console.log(`🔍 [DRY RUN] Old: "${prod.name}" -> New: "${newName}" | Sizes: ${parsed.sizes.join(',')}`);
            continue;
        }

        const { error: upErr } = await supabase.from('Product').update({
            name: newName,
            sizes: parsed.sizes,
            description: `Imported from Telegram. Tailles disponibles: ${parsed.sizes.join(', ')}`,
            updatedAt: new Date().toISOString()
        }).eq('id', prod.id);

        if (upErr) {
            console.error(`  ❌ Failed to update ${prod.id}: ${upErr.message}`);
        } else {
            console.log(`  ✅ Updated: ${newName}`);
        }
    }
    console.log("🏁 Fix process finished!");
}

function extractText(text: any): string {
    if (typeof text === 'string') return text;
    if (Array.isArray(text)) {
        return text.map(t => (typeof t === 'string' ? t : t.text)).join('');
    }
    return '';
}

function parseProductText(text: string) {
    const priceMatch = text.match(/(\d+)\s*\$/);
    const price = priceMatch ? priceMatch[1] : "0";
    
    // Extract sizes
    const sizeMatches = text.match(/\b(36|38|40|42|44|46|48|50|52|S|M|L|XL|XXL|2XL|3XL)\b/gi);
    const sizes = sizeMatches ? Array.from(new Set(sizeMatches.map(s => s.toUpperCase()))) : [];
    
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    let rawName = lines[0] || "Produit Telegram";
    
    // Clean and Translate
    let name = translateAndClean(rawName);
    
    if (name.length > 100) name = name.substring(0, 97) + "...";
    if (!name || name === "") name = "Produit Sharufa";

    return { name, price, sizes };
}

function translateAndClean(text: string): string {
    let cleaned = text.toLowerCase();
    
    // Remove emojis
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');
    
    // Remove price patterns remaining (e.g. "20$")
    cleaned = cleaned.replace(/\d+\s*\$/g, ' ');

    // Replace common Turkish delimiters with space to avoid word join
    cleaned = cleaned.replace(/[.,]/g, ' ');

    // Apply translations
    for (const [turk, french] of Object.entries(TRANSLATIONS)) {
        // Using a simpler approach than \b for phrases with potential special chars
        const regex = new RegExp(`(^|\\s)${turk}(\\s|$)`, 'gi');
        cleaned = cleaned.replace(regex, `$1${french}$2`);
    }

    // Clean sizes (numeric and common letter sizes) after translation to avoid conflicts
    cleaned = cleaned.replace(/(^|\s)(36|38|40|42|44|46|48|50|52|54|s|m|l|xl|xxl|2xl|3xl)(\s|$)/gi, ' ');

    // Specific cleaning for things like "3’lu" or "3-lü"
    cleaned = cleaned.replace(/3\s*[’'-]\s*lu/gi, 'Ensemble 3 pièces');

    // Final cleanup: collapse spaces and trim
    return cleaned.replace(/\s+/g, ' ').trim();
}

main().catch(console.error);
