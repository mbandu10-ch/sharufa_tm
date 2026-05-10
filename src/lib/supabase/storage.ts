import { createAdminClient } from '@/utils/supabase/admin'
import { validateUploadFile, UploadCategory } from '../upload-validation'


/**
 * Télécharge un fichier vers un bucket Supabase spécifié.
 * Retourne le chemin du fichier ou l'URL publique.
 * Utilise le client Admin pour contourner les politiques RLS.
 */
export async function uploadFile(
  file: File,
  bucket: 'shops' | 'products' | 'sourcing' | 'cargo' | 'documents' | 'logistics',
  folder?: string,
  categoryOverride?: UploadCategory
) {
  // Determine validation category
  const category: UploadCategory = categoryOverride || (
    bucket === 'shops' || bucket === 'products' || bucket === 'sourcing' ? 'image' :
    bucket === 'cargo' || bucket === 'logistics' ? 'media' : 'document'
  );

  // Validate file
  const validation = await validateUploadFile(file, category);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = createAdminClient()

  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = folder ? `${folder}/${fileName}` : fileName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    console.error(`Error uploading to ${bucket}:`, error)
    throw new Error(`Échec du téléchargement dans le bucket ${bucket}: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    path: data?.path || filePath,
    publicUrl
  }
}

/**
 * Télécharge plusieurs fichiers vers un bucket Supabase spécifié.
 */
export async function uploadMultipleFiles(
  files: File[],
  bucket: 'shops' | 'products' | 'sourcing' | 'cargo' | 'documents' | 'logistics',
  folder?: string,
  categoryOverride?: UploadCategory
) {
  const uploadPromises = files.map(file => uploadFile(file, bucket, folder, categoryOverride))
  return Promise.all(uploadPromises)
}


/**
 * Supprime un fichier du bucket spécifié.
 */
export async function deleteFile(
  bucket: 'shops' | 'products' | 'sourcing' | 'cargo' | 'documents' | 'logistics',
  path: string
) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error(`Error deleting file from ${bucket}/${path}:`, error)
    throw new Error(`Échec de la suppression dans le bucket ${bucket}: ${error.message}`)
  }

  return data
}

/**
 * Supprime tous les fichiers dans un dossier spécifié.
 * Utile lors de la suppression d'un produit pour nettoyer toutes ses images d'un coup.
 */
export async function deleteFolder(
  bucket: 'shops' | 'products' | 'sourcing' | 'cargo' | 'documents' | 'logistics',
  folderPath: string
) {
  const supabase = createAdminClient()
  
  // Lister tous les fichiers dans le dossier
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list(folderPath)

  if (listError) {
    console.error(`Error listing files for deletion in ${bucket}/${folderPath}:`, listError)
    return
  }

  if (!files || files.length === 0) return

  // Créer les chemins complets
  const filesToRemove = files.map(file => `${folderPath}/${file.name}`)

  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(filesToRemove)

  if (error) {
    console.error(`Error deleting folder ${bucket}/${folderPath}:`, error)
    throw new Error(`Échec de la suppression du dossier ${folderPath}: ${error.message}`)
  }

  return data
}
