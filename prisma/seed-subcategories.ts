import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Démarrage de la reconstruction de la taxonomie...')

  const taxonomy = [
    {
      name: "Mode & Accessoires",
      slug: "mode-accessoires",
      sub: [
        { 
            name: "Hommes", slug: "hommes", 
            items: [
                { name: "T-shirts", slug: "tshirts-hommes" },
                { name: "Pantalons", slug: "pantalons-hommes" },
                { name: "Vestes", slug: "vestes-hommes" },
                { name: "Chaussures", slug: "chaussures-hommes" },
                { name: "Costumes", slug: "costumes-hommes" },
                { name: "Sous-vêtements", slug: "sous-vetements-hommes" }
            ]
        },
        { 
            name: "Femmes", slug: "femmes", 
            items: [
                { name: "Sacs", slug: "sacs-femmes" },
                { name: "Robes", slug: "robes-femmes" },
                { name: "Jupes", slug: "jupes-femmes" },
                { name: "T-shirts", slug: "tshirts-femmes" },
                { name: "Vestes", slug: "vestes-femmes" },
                { name: "Lingerie", slug: "lingerie-femmes" },
                { name: "Maillots de bain", slug: "maillots-de-bain-femmes" }
            ]
        },
        { 
            name: "Enfants", slug: "enfants", 
            items: [
                { name: "Bébé", slug: "bebe" },
                { name: "Filles", slug: "filles" },
                { name: "Garçons", slug: "garcons" },
                { name: "Chaussures enfant", slug: "chaussures-enfant" }
            ]
        },
        { 
            name: "Accessoires", slug: "accessoires-mode", 
            items: [
                { name: "Montres", slug: "montres" },
                { name: "Lunettes", slug: "lunettes" },
                { name: "Bijoux", slug: "bijoux" },
                { name: "Maroquinerie", slug: "maroquinerie" }
            ]
        }
      ]
    },
    {
      name: "Électronique & Technologie",
      slug: "electronique-technologie",
      sub: [
        { name: "Smartphones & Tablettes", slug: "smartphones-tablettes", items: [{ name: "Accessoires", slug: "acc-tel" }, { name: "Pièces de rechange", slug: "pieces-tel" }] },
        { name: "Informatique", slug: "informatique", items: [{ name: "Laptops", slug: "laptops" }, { name: "Composants", slug: "composants-pc" }, { name: "Périphériques", slug: "peripheriques-pc" }] },
        { name: "Audio & Son", slug: "audio-son", items: [{ name: "Casques", slug: "casques" }, { name: "Enceintes", slug: "enceintes" }] },
        { name: "Photographie & Vidéo", slug: "photo-video" },
        { name: "TV & Home Cinéma", slug: "tv-home-cinema" }
      ]
    },
    {
      name: "Maison & Décoration",
      slug: "maison-decoration",
      sub: [
        { name: "Mobilier", slug: "mobilier", items: [{ name: "Salon", slug: "salon" }, { name: "Chambre", slug: "chambre" }, { name: "Bureau", slug: "bureau-mobilier" }] },
        { name: "Luminaires", slug: "luminaires" },
        { name: "Textile de maison", slug: "textile-maison" },
        { name: "Jardin & Bricolage", slug: "jardin-bricolage" }
      ]
    },
    {
      name: "Beauté & Cosmétiques",
      slug: "beaute-cosmetiques",
      sub: [
        { name: "Maquillage", slug: "maquillage" },
        { name: "Soins visage & corps", slug: "soins-corps-visage" },
        { name: "Parfumerie", slug: "parfumerie" },
        { name: "Soins capillaires", slug: "soins-capillaires" }
      ]
    },
    {
      name: "Sport & Fitness",
      slug: "sport-fitness",
      sub: [
        { name: "Vêtements de sport", slug: "vetements-sport" },
        { name: "Équipement de fitness", slug: "equipement-fitness" },
        { name: "Sports d'équipe", slug: "sports-equipe" }
      ]
    },
    {
      name: "Enfants & Jouets",
      slug: "enfants-jouets-cat",
      sub: [
        { name: "Jeux d'éveil", slug: "jeux-eveil" },
        { name: "Jeux de construction", slug: "jeux-construction" },
        { name: "Poupées & Figurines", slug: "poupees-figurines" }
      ]
    },
    {
      name: "Automobile & Accessoires",
      slug: "automobile-accessoires",
      sub: [
        { name: "Pièces de rechange", slug: "pieces-auto" },
        { name: "Équipement & Accessoires", slug: "accessoires-auto" },
        { name: "Entretien", slug: "entretien-auto" }
      ]
    },
    {
      name: "Industrie & Gros",
      slug: "industrie-gros",
      sub: [
        { name: "Machines industrielles", slug: "machines-indus" },
        { name: "Équipement de sécurité", slug: "securite-epi" },
        { name: "Fournitures commerciales", slug: "fournitures-comm" }
      ]
    },
    {
      name: "Véhicules & Mobilité",
      slug: "vehicules-mobilite",
      sub: [
        { name: "Voitures", slug: "voitures" },
        { name: "Motos & Scooters", slug: "motos-scooters" },
        { name: "Vélos & Mobilité douce", slug: "velos-mobilite" }
      ]
    },
    {
      name: "Construction & Matériaux",
      slug: "construction-materiaux",
      sub: [
        { name: "Outillage", slug: "outillage" },
        { name: "Matériaux de base", slug: "materiaux-base" },
        { name: "Électricité & Plomberie", slug: "elec-plomb" }
      ]
    },
    {
      name: "Emballage & Conditionnement",
      slug: "emballage-conditionnement",
      sub: [
        { name: "Boîtes & Cartons", slug: "boites-cartons" },
        { name: "Sacs d'emballage", slug: "sacs-emballage" },
        { name: "Étiquettes & Rubans", slug: "etiquettes-rubans" }
      ]
    },
    {
      name: "Cuisine & Ustensiles",
      slug: "cuisine-ustensiles",
      sub: [
        { name: "Petit électroménager", slug: "petit-electromenager" },
        { name: "Batteries de cuisine", slug: "batteries-cuisine" },
        { name: "Arts de la table", slug: "arts-table" }
      ]
    },
    {
      name: "Produits ménagers & Hygiène",
      slug: "produits-menagers-hygiene",
      sub: [
        { name: "Entretien maison", slug: "entretien-maison" },
        { name: "Lessive & Soin linge", slug: "lessive-linge" },
        { name: "Hygiène papier", slug: "hygiene-papier" }
      ]
    },
    {
      name: "Soins corporels",
      slug: "soins-corporels",
      sub: [
        { name: "Hygiène bucco-dentaire", slug: "hygiene-dentaire" },
        { name: "Savons & Douche", slug: "savons-douche" },
        { name: "Rasage & Épilation", slug: "rasage-epilation" }
      ]
    },
    {
      name: "Alimentaire & Denrées",
      slug: "alimentaire-denrees",
      sub: [
        { name: "Épicerie salée", slug: "epicerie-salee" },
        { name: "Épicerie sucrée", slug: "epicerie-sucree" },
        { name: "Boissons", slug: "boissons" },
        { name: "Café & Thé", slug: "cafe-the" }
      ]
    }
  ];

  let count = 0;

  for (const level1 of taxonomy) {
    const catL1 = await prisma.category.upsert({
      where: { slug: level1.slug },
      update: { name: level1.name },
      create: { name: level1.name, slug: level1.slug }
    });
    count++;
    console.log(`+ ${level1.name}`);

    if (level1.sub) {
      for (const level2 of level1.sub) {
        const catL2 = await prisma.category.upsert({
          where: { slug: level2.slug },
          update: { name: level2.name, parentId: catL1.id },
          create: { name: level2.name, slug: level2.slug, parentId: catL1.id }
        });
        count++;
        console.log(`  - ${level2.name}`);

        if (level2.items) {
          for (const level3 of level2.items) {
            await prisma.category.upsert({
              where: { slug: level3.slug },
              update: { name: level3.name, parentId: catL2.id },
              create: { name: level3.name, slug: level3.slug, parentId: catL2.id }
            });
            count++;
            console.log(`    * ${level3.name}`);
          }
        }
      }
    }
  }

  console.log(`\n✅ Terminé ! ${count} catégories créées/mises à jour.`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
