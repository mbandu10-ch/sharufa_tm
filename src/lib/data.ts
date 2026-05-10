import { prisma } from "./prisma";

export async function getFeaturedProducts(locale: string = 'fr', limit = 8) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'APPROVED',
        stock: { gt: 0 },
        shop: {
          status: 'APPROVED',
          isVisible: true
        }
      },
      take: limit,
      orderBy: [
        { isSharufa: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        shop: {
          select: {
            name: true,
            slug: true
          }
        },
        originCountry: {
          select: {
            name: true,
            code: true
          }
        },
        category: {
          include: {
            translations: {
              where: { locale }
            }
          }
        },
        translations: {
          where: { locale }
        }
      }
    });

    return products.map(product => ({
      ...product,
      name: product.translations[0]?.name || product.name,
      description: product.translations[0]?.description || product.description,
      category: {
        ...product.category,
        name: product.category.translations[0]?.name || product.category.name
      }
    }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getFeaturedShops(locale: string = 'fr', limit = 6) {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        isVisible: true,
        status: 'APPROVED'
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: { products: { where: { status: 'APPROVED' } } }
        }
      }
    });

    return shops;
  } catch (error) {
    console.error("Error fetching featured shops:", error);
    return [];
  }
}

export async function getPlatformStats() {
  try {
    const [productCount, shopCount, countryCount] = await Promise.all([
      prisma.product.count({ 
        where: { 
          status: 'APPROVED',
          stock: { gt: 0 },
          shop: {
            status: 'APPROVED',
            isVisible: true
          }
        } 
      }),
      prisma.shop.count({ where: { status: 'APPROVED', isVisible: true } }),
      prisma.country.count({ where: { active: true } })
    ]);

    return {
      products: productCount,
      shops: shopCount,
      countries: countryCount
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return { products: 0, shops: 0, countries: 0 };
  }
}
