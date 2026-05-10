'use server'

import { createSharedServerClient as createClient } from '@sharufa/auth/server'
import { prisma } from '@sharufa/db'
import { slugify } from '@root/lib/utils/slugify'
import { uploadFile, uploadMultipleFiles, deleteFolder, deleteFile } from '@root/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@root/lib/resend'
import { ShopRequestReceivedEmail } from '@components/emails/ShopRequestReceivedEmail'
import { NewSellerApplicationAlert } from '@components/emails/NewSellerApplicationAlert'
import { SHOP_DOMAIN_MAPPING } from '@root/lib/constants/shop-categories'
import { ShopType } from '@prisma/client'
import { checkRateLimit } from '@root/lib/rate-limit'


export async function getDomainCategories() {
  try {
    const domains = await prisma.category.findMany({
      where: { parentId: null },
      select: { id: true, name: true, slug: true }
    })
    return { domains }
  } catch (error) {
    console.error('Error fetching domains:', error)
    return { error: 'Impossible de récupérer les catégories.' }
  }
}

export async function getCategoryAttributeTemplates(categoryId: string) {
  try {

    const templates = await prisma.categoryAttributeTemplate.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'asc' }
    })
    return { templates }

  } catch (error) {
    console.error('Error fetching templates:', error)
    return { error: 'Impossible de récupérer les caractéristiques de la catégorie.' }
  }
}

export async function registerShop(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté pour ouvrir une boutique.' }
  }

  // Rate Limiting
  const rateLimit = await checkRateLimit(user.id, 'upload')
  if (!rateLimit.allowed) {
    return { error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
  }


  try {
    // 1. Vérifier si l'utilisateur a déjà une boutique (le propriétaire ne peut en avoir qu'une)
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: user.id }
    })

    if (existingShop) {
      return { error: 'Vous possédez déjà une boutique enregistrée sur Sharufa.' }
    }

    // 2. Vérifier/Récupérer le profil et son statut
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { vendorStatus: true, id: true, firstName: true, lastName: true }
    })

    if (profile?.vendorStatus === 'PENDING') {
      return { error: 'Une demande d\'ouverture est déjà en cours de traitement pour votre compte.' }
    }

    if (profile?.vendorStatus === 'APPROVED') {
       return { error: 'Votre compte est déjà associé à une boutique approuvée.' }
    }

    const shopName = formData.get('shopName') as string
    const country = formData.get('country') as string
    const description = formData.get('description') as string
    const type = (formData.get('type') || 'GENERAL_STORE') as ShopType
    const logoFile = formData.get('logo') as File | null
    const bannerFile = formData.get('banner') as File | null
    const allowedCategoryIdsJson = formData.get('allowedCategoryIds') as string
    const allowedCategoryIds = allowedCategoryIdsJson ? JSON.parse(allowedCategoryIdsJson) : []

    // Validation des champs obligatoires
    if (!shopName || shopName.trim().length < 3) {
      return { error: 'Le nom de la boutique est requis (min. 3 caractères).' }
    }

    if (!country) {
      return { error: 'Le pays d\'origine est requis.' }
    }

    // Génération du slug unique
    let slug = slugify(shopName)
    if (!slug) {
       return { error: 'Le nom de la boutique est invalide pour créer une adresse web.' }
    }
    const slugExists = await prisma.shop.findUnique({
      where: { slug }
    })

    if (slugExists) {
      const suffix = Math.random().toString(36).substring(2, 6)
      slug = `${slug}-${suffix}`
    }

    // 4. Créer la boutique avec le statut PENDING et initialiser le profil légal
    const newShop = await prisma.shop.create({
      data: {
        name: shopName,
        slug,
        description,
        country,
        type,
        ownerId: user.id,
        logo: null, // On mettra à jour après l'upload
        banner: null,
        allowedCategoryIds: allowedCategoryIds,
        status: 'PENDING',
        verificationStatus: 'INCOMPLETE',
        isVisible: false,
        legalProfile: {
          create: {}
        }
      }
    })

    let logoUrl = null
    let bannerUrl = null

    if (logoFile && logoFile.size > 0) {
      const { publicUrl } = await uploadFile(logoFile, 'shops', `${newShop.id}`)
      logoUrl = publicUrl
    }

    if (bannerFile && bannerFile.size > 0) {
      const { publicUrl } = await uploadFile(bannerFile, 'shops', `${newShop.id}`)
      bannerUrl = publicUrl
    }

    if (logoUrl || bannerUrl) {
      await prisma.shop.update({
        where: { id: newShop.id },
        data: { logo: logoUrl, banner: bannerUrl }
      })
    }

    // 5. Mettre à jour le statut vendeur dans le Profile
    const updatedProfile = await prisma.profile.update({
      where: { id: user.id },
      data: { vendorStatus: 'PENDING' }
    })

    if (user.email) {
      try {
        const sellerName = `${updatedProfile.firstName || ''} ${updatedProfile.lastName || ''}`.trim() || 'Vendeur'
        
        // 1. Email au Vendeur (Confirmation)
        await sendEmail({
          from: 'Sharufa B2B <b2b@sharufa.com>',
          to: user.email,
          subject: 'Votre demande d’ouverture de boutique a bien été reçue',
          react: ShopRequestReceivedEmail({
            sellerName,
            shopName,
            shopCountry: country,
          })
        })

        // 2. Email à l'Admin (Alerte)
        await sendEmail({
          from: 'Sharufa Système <b2b@sharufa.com>',
          to: 'b2b@sharufa.com',
          subject: `Nouvelle demande de boutique : ${shopName}`,
          react: NewSellerApplicationAlert({
            sellerName,
            shopName,
            shopCountry: country,
            adminShopLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://sharufa.com'}/admin/shops`
          })
        })
      } catch (emailError) {
        console.error('Failed to send registration emails:', emailError)
      }
    }
    
    revalidatePath('/register')
    return { success: true }
    
  } catch (error: any) {
    console.error('CRITICAL: Error in registerShop:', error)
    
    // Erreurs Prisma spécifiques

    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] || []
      if (target.includes('name')) return { error: 'Ce nom de boutique est déjà utilisé.' }
      if (target.includes('slug')) return { error: 'Une boutique avec une adresse similaire existe déjà.' }
      if (target.includes('ownerId')) return { error: 'Votre compte est déjà lié à une boutique.' }
      return { error: 'Une information unique (nom ou propriétaire) est déjà utilisée pour une autre boutique.' }
    }

    // Erreurs de stockage
    if (error.message?.includes('bucket')) {
      return { error: 'Erreur lors de l\'envoi des images. Veuillez réessayer sans logo ou avec une image plus petite.' }
    }

    return { error: `Une erreur technique est survenue (${error.code || 'UNKNOWN'}). Veuillez contacter le support.` }
  }
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Vous devez être connecté pour ajouter un produit.' }
    }

    // Rate Limiting
    const rateLimit = await checkRateLimit(user.id, 'upload')
    if (!rateLimit.allowed) {
      return { error: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil((rateLimit.retryAfterMs || 0) / 60000)} minutes.` }
    }


    try {
      // Récupérer la boutique de l'utilisateur
      const shop = await prisma.shop.findUnique({
        where: { ownerId: user.id }
      })

      if (!shop) {
        return { error: 'Vous devez créer une boutique avant d\'ajouter des produits.' }
      }

      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const price = parseFloat(formData.get('price') as string)
      const stock = parseInt(formData.get('stock') as string)
      const categoryId = formData.get('categoryId') as string
      const originCountryId = formData.get('originCountryId') as string
      const attributesJson = formData.get('attributes') as string
      const attributes = attributesJson ? JSON.parse(attributesJson) : {}
      
      const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
      const length = formData.get('length') ? parseFloat(formData.get('length') as string) : null
      const width = formData.get('width') ? parseFloat(formData.get('width') as string) : null
      const height = formData.get('height') ? parseFloat(formData.get('height') as string) : null
      
      // Validation du domaine autorisé
      const selectedCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { 
          parent: { 
            include: { 
              parent: {
                include: {
                  parent: true
                }
              } 
            } 
          } 
        }
      })

      if (!selectedCategory) {
        return { error: 'Catégorie invalide.' }
      }

      const domain = selectedCategory.parent?.parent?.parent || selectedCategory.parent?.parent || selectedCategory.parent || selectedCategory
      
      // Validation stricte par ShopType
      const allowedDomainsForType = SHOP_DOMAIN_MAPPING[shop.type] || []
      if (!allowedDomainsForType.includes(domain.name)) {
        return { error: `Votre type de boutique (${shop.type}) ne vous autorise pas à publier dans le domaine "${domain.name}".` }
      }

      // Validation par allowedCategoryIds (si spécifiés manuellement)
      const allowedDomainIds = shop.allowedCategoryIds || []
      if (allowedDomainIds.length > 0 && !allowedDomainIds.includes(domain.id)) {
        return { error: 'Cette catégorie n\'appartient pas à vos domaines autorisés spécifiques.' }
      }

      // --- Validation des attributs dynamiques ---
      const templates = await prisma.categoryAttributeTemplate.findMany({
        where: { categoryId }
      })

      for (const t of templates) {
        const val = attributes[t.fieldKey]
        
        if (t.required && (val === undefined || val === null || val === '')) {
          return { error: `Le champ "${t.label}" est obligatoire.` }
        }

        if (val !== undefined && val !== null && val !== '') {
          if (t.fieldType === 'NUMBER' && isNaN(Number(val))) {
            return { error: `Le champ "${t.label}" doit être un nombre.` }
          }
          if (t.fieldType === 'SELECT' || t.fieldType === 'MULTI_SELECT') {
             const options = (t.options as string[]) || []
             if (t.fieldType === 'SELECT' && !options.includes(val)) {
                return { error: `Valeur invalide pour "${t.label}".` }
             }
             if (t.fieldType === 'MULTI_SELECT') {
                const vals = Array.isArray(val) ? val : [val]
                if (!vals.every(v => options.includes(v))) {
                   return { error: `Valeurs invalides pour "${t.label}".` }
                }
             }
          }
        }
      }
      
      // MOQ Logic
      let minOrderQuantity = parseInt(formData.get('minOrderQuantity') as string) || 1
      
      if (shop.type === 'WHOLESALE_STORE' && minOrderQuantity < 6) {
        return { error: 'Les grossistes doivent imposer un minimum de commande de 6 unités.' }
      }
      
      // Si ce n'est pas un grossiste, on s'assure que le MOQ est au moins 1
      if (shop.type !== 'WHOLESALE_STORE' && minOrderQuantity < 1) {
        minOrderQuantity = 1
      }

      // Récupérer les fichiers d'images (max 5)
      const imageFiles: File[] = []
      for (let i = 0; i < 5; i++) {
        const file = formData.get(`images[${i}]`) as File | null
        if (file && file.size > 0) {
          imageFiles.push(file)
        }
      }

      if (imageFiles.length === 0) {
        return { error: 'Au moins une image est requise.' }
      }

      // Génération du slug unique
      let slug = slugify(name)
      const slugExists = await prisma.product.findUnique({
        where: { slug }
      })

      if (slugExists) {
        const suffix = Math.random().toString(36).substring(2, 6)
        slug = `${slug}-${suffix}`
      }

      const sizesJson = formData.get('sizes') as string
      const sizes = sizesJson ? JSON.parse(sizesJson) : []
      const colorsJson = formData.get('colors') as string
      const colors = colorsJson ? JSON.parse(colorsJson) : []

      // 1. Créer le produit d'abord pour avoir l'ID
      const product = await (prisma.product as any).create({
        data: {
          name,
          slug,
          description,
          price,
          stock,
          images: [], // Vide temporairement
          categoryId,
          shopId: shop.id,
          originCountryId: originCountryId || null,
          minOrderQuantity,
          weight,
          length,
          width,
          height,
          attributes: attributes || null,
          isSharufa: false,
          sizes,
          colors
        }
      })

      // 2. Upload des images vers Supabase Storage en utilisant l'ID du produit
      const uploadResults = await uploadMultipleFiles(
        imageFiles, 
        'products', 
        `${shop.id}/${product.id}`
      )
      
      const imageUrls = uploadResults.map(res => res.publicUrl)

      // 3. Mettre à jour le produit avec les URLs réelles
      await prisma.product.update({
        where: { id: product.id },
        data: { images: imageUrls }
      })

      revalidatePath('/dashboard/products')
      revalidatePath('/marketplace')
      
      return { success: true, productId: product.id }


  } catch (error: any) {
    console.error('Error creating product:', error)
    return { error: 'Une erreur est survenue lors de l\'ajout du produit.' }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté pour modifier un produit.' }
  }

  try {
    // Récupérer le produit et vérifier l'appartenance
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true }
    })

    if (!product) {
      return { error: 'Produit non trouvé.' }
    }

    if (!product.shop || product.shop.ownerId !== user.id) {
      return { error: 'Vous n\'avez pas la permission de modifier ce produit.' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const categoryId = formData.get('categoryId') as string
    const originCountryId = formData.get('originCountryId') as string
    const attributesJson = formData.get('attributes') as string
    const attributes = attributesJson ? JSON.parse(attributesJson) : {}

    const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
    const length = formData.get('length') ? parseFloat(formData.get('length') as string) : null
    const width = formData.get('width') ? parseFloat(formData.get('width') as string) : null
    const height = formData.get('height') ? parseFloat(formData.get('height') as string) : null
    
    // Validation du domaine autorisé
    const selectedCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { 
        parent: { 
          include: { 
            parent: {
              include: {
                parent: true
              }
            } 
          } 
        } 
      }
    })

    if (!selectedCategory) {
      return { error: 'Catégorie invalide.' }
    }

    const domain = selectedCategory.parent?.parent?.parent || selectedCategory.parent?.parent || selectedCategory.parent || selectedCategory
    
    // Validation stricte par ShopType
    const allowedDomainsForType = SHOP_DOMAIN_MAPPING[product.shop!.type] || []
    if (!allowedDomainsForType.includes(domain.name)) {
      return { error: `Votre type de boutique ne vous autorise pas à publier dans le domaine "${domain.name}".` }
    }

    const allowedDomainIds = product.shop!.allowedCategoryIds || []
    if (allowedDomainIds.length > 0 && !allowedDomainIds.includes(domain.id)) {
      return { error: 'Cette catégorie n\'appartient pas à vos domaines autorisés.' }
    }

    // --- Validation des attributs dynamiques ---
    const templates = await prisma.categoryAttributeTemplate.findMany({
      where: { categoryId }
    })

    for (const t of templates) {
      const val = attributes[t.fieldKey]
      
      if (t.required && (val === undefined || val === null || val === '')) {
        return { error: `Le champ "${t.label}" est obligatoire.` }
      }

      if (val !== undefined && val !== null && val !== '') {
        if (t.fieldType === 'NUMBER' && isNaN(Number(val))) {
          return { error: `Le champ "${t.label}" doit être un nombre.` }
        }
        if (t.fieldType === 'SELECT' || t.fieldType === 'MULTI_SELECT') {
           const options = (t.options as string[]) || []
           if (t.fieldType === 'SELECT' && !options.includes(val)) {
              return { error: `Valeur invalide pour "${t.label}".` }
           }
           if (t.fieldType === 'MULTI_SELECT') {
              const vals = Array.isArray(val) ? val : [val]
              if (!vals.every(v => options.includes(v))) {
                 return { error: `Valeurs invalides pour "${t.label}".` }
              }
           }
        }
      }
    }
    
    // MOQ Logic
    let minOrderQuantity = parseInt(formData.get('minOrderQuantity') as string) || 1
    if (product.shop?.type === 'WHOLESALE_STORE' && minOrderQuantity < 6) {
      return { error: 'Les grossistes doivent imposer un minimum de commande de 6 unités.' }
    }
    if (product.shop?.type !== 'WHOLESALE_STORE' && minOrderQuantity < 1) {
      minOrderQuantity = 1
    }

    // Gérer les images (mélange de nouvelles images et d'existantes)
    const existingImagesJson = formData.get('existingImages') as string
    let newImageUrls: string[] = existingImagesJson ? JSON.parse(existingImagesJson) : []

    // Identifier les images supprimées pour les effacer du storage
    const removedImages = product.images.filter(url => !newImageUrls.includes(url))
    for (const url of removedImages) {
      try {
        const urlParts = url.split('/products/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          await deleteFile('products', filePath)
        }
      } catch (err) {
        console.error(`Failed to delete removed image ${url}:`, err)
      }
    }

    // Récupérer les nouveaux fichiers d'images
    const newImageFiles: File[] = []
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`images[${i}]`) as File | null
      if (file && file.size > 0) {
        newImageFiles.push(file)
      }
    }

    if (newImageUrls.length === 0 && newImageFiles.length === 0) {
      return { error: 'Au moins une image est requise.' }
    }

    if (newImageFiles.length > 0) {
      const uploadResults = await uploadMultipleFiles(
        newImageFiles, 
        'products', 
        `${product.shop?.id}/${product.id}`
      )
      const newUrls = uploadResults.map(res => res.publicUrl)
      newImageUrls = [...newImageUrls, ...newUrls]
    }

    // Limiter à 5 images
    newImageUrls = newImageUrls.slice(0, 5)

    const sizesJson = formData.get('sizes') as string
    const sizes = sizesJson ? JSON.parse(sizesJson) : []
    const colorsJson = formData.get('colors') as string
    const colors = colorsJson ? JSON.parse(colorsJson) : []

    // Mettre à jour le produit
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        stock,
        images: newImageUrls,
        categoryId,
        originCountryId: originCountryId || null,
        minOrderQuantity,
        weight,
        length,
        width,
        height,
        attributes: attributes || null,
        sizes,
        colors
      }
    })

    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/edit/${productId}`)
    revalidatePath('/marketplace')
    revalidatePath(`/product/${product.slug}`)
    
    return { success: true }

  } catch (error: any) {
    console.error('Error updating product:', error)
    return { error: 'Une erreur est survenue lors de la modification du produit.' }
  }
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté pour supprimer un produit.' }
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true }
    })

    if (!product) {
      return { error: 'Produit non trouvé.' }
    }

    if (product.shop?.ownerId !== user.id) {
      return { error: 'Vous n\'avez pas la permission de supprimer ce produit.' }
    }

    // Supprimer les images du stockage Supabase
    try {
      await deleteFolder('products', `${product.shop?.id}/${product.id}`)
    } catch (storageError) {
      console.error('Failed to delete product images from storage:', storageError)
      // On continue quand même la suppression en DB
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    revalidatePath('/dashboard/products')
    revalidatePath('/marketplace')
    
    return { success: true }

  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { error: 'Une erreur est survenue lors de la suppression du produit.' }
  }
}

export async function bulkUpdateProductCategory(productIds: string[], categoryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Vous devez être connecté pour modifier des produits.' }
  }

  try {
    // Vérifier la boutique
    const shop = await prisma.shop.findUnique({
      where: { ownerId: user.id }
    })

    if (!shop) {
      return { error: 'Boutique introuvable.' }
    }

    // Validation du domaine autorisé
    const selectedCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { 
        parent: { 
          include: { 
            parent: {
              include: {
                parent: true
              }
            } 
          } 
        } 
      }
    })

    if (!selectedCategory) {
      return { error: 'Catégorie invalide.' }
    }

    const domain = selectedCategory.parent?.parent?.parent || selectedCategory.parent?.parent || selectedCategory.parent || selectedCategory
    
    // Validation stricte par ShopType
    const allowedDomainsForType = SHOP_DOMAIN_MAPPING[shop.type] || []
    if (!allowedDomainsForType.includes(domain.name)) {
      return { error: `Votre type de boutique ne vous autorise pas à publier dans le domaine "${domain.name}".` }
    }

    const allowedDomainIds = shop.allowedCategoryIds || []
    if (allowedDomainIds.length > 0 && !allowedDomainIds.includes(domain.id)) {
      return { error: 'Cette catégorie n\'appartient pas à vos domaines autorisés.' }
    }

    // Vérifier l'appartenance des produits
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    if (products.some(p => p.shopId !== shop.id)) {
      return { error: 'Vous n\'avez pas la permission de modifier tous les produits sélectionnés.' }
    }

    // Mise à jour de la catégorie (sans réinitialiser les attributs, tailles, couleurs selon la demande du client)
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { categoryId }
    })

    revalidatePath('/dashboard/products')
    revalidatePath('/marketplace')
    
    return { success: true }

  } catch (error: any) {
    console.error('Error bulk updating category:', error)
    return { error: 'Une erreur est survenue lors de la mise à jour des produits.' }
  }
}

