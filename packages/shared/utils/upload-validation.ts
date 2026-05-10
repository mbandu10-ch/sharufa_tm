/**
 * Utility for strict file upload validation.
 * Checks MIME types, file sizes, and magic bytes (signatures).
 */

export type UploadCategory = 'image' | 'document' | 'media';

const ALLOWED_MIME_TYPES: Record<UploadCategory, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  media: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo'],
};

const MAX_FILE_SIZES: Record<UploadCategory, number> = {
  image: 5 * 1024 * 1024,      // 5 MB
  document: 10 * 1024 * 1024,  // 10 MB
  media: 50 * 1024 * 1024,     // 50 MB
};

/**
 * Validates a file before upload.
 * 
 * @param file - The File object to validate
 * @param category - The category of upload for specific rules
 * @returns Object with valid status and optional error message
 */
export async function validateUploadFile(
  file: File,
  category: UploadCategory
): Promise<{ valid: boolean; error?: string }> {
  // 1. Basic size check
  if (file.size > MAX_FILE_SIZES[category]) {
    const maxSizeMB = MAX_FILE_SIZES[category] / (1024 * 1024);
    return { valid: false, error: `Le fichier est trop volumineux (max ${maxSizeMB}MB).` };
  }

  // 2. MIME type check (declared)
  if (!ALLOWED_MIME_TYPES[category].includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé : ${file.type}.` };
  }

  // 3. Magic Bytes check (optional but recommended for production)
  // We check the first few bytes of the file to ensure it's not a renamed malicious script
  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const arr = new Uint8Array(buffer);
    const header = arr.reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '').toUpperCase();

    // Common signatures
    const signatures: Record<string, string[]> = {
      '89504E47': ['image/png'],
      'FFD8FF': ['image/jpeg'],
      '47494638': ['image/gif'],
      '25504446': ['application/pdf'],
      '52494646': ['image/webp', 'video/webp'], // WebP starts with RIFF
      '00000018': ['video/mp4'],
      '00000020': ['video/mp4'],
      '66747970': ['video/mp4'], // ftyp
    };

    // Check if the header matches any known signature for the declared MIME type
    let isSignatureMatch = false;
    for (const [sig, mimes] of Object.entries(signatures)) {
      if (header.startsWith(sig)) {
        if (mimes.includes(file.type)) {
          isSignatureMatch = true;
          break;
        } else {
          // Found a signature but it doesn't match the declared type!
          return { valid: false, error: `Contenu du fichier invalide : signature ${sig} ne correspond pas au type déclaré ${file.type}.` };
        }
      }
    }

    // If we have a signature for this type, but it didn't match, it's suspicious
    // Note: Some files might not be in our signature list, we might allow them if we're not sure,
    // but for common types like images, we should be strict.
    const strictTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!isSignatureMatch && strictTypes.includes(file.type)) {
      return { valid: false, error: `Le contenu du fichier ne correspond pas au format ${file.type} (signature manquante ou invalide).` };
    }
    
  } catch (e) {
    console.error('Error during magic bytes check:', e);
    // In case of error, we might want to fail closed or open depending on policy
    // Fail closed for security
    return { valid: false, error: 'Erreur lors de la validation du contenu du fichier.' };
  }

  return { valid: true };
}
