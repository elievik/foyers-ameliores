import imageCompression from 'browser-image-compression';

/**
 * Compresse une image côté client pour réduire son poids avant l'upload.
 * Par défaut : largeur maximale 1920px, qualité 80%.
 * Si le fichier n'est pas une image, il est retourné tel quel.
 * @param {File} file - Le fichier à compresser.
 * @returns {Promise<File>} Le fichier compressé (ou l'original si non-image).
 */
export const compressImage = async (file) => {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }

  console.log(`Original size: ${file.size / 1024 / 1024} MB`);
  
  const options = {
    maxSizeMB: 1, // On vise 1 Mo maximum
    maxWidthOrHeight: 1920, // Largeur ou hauteur maximale 1920px (HD)
    useWebWorker: true,
    fileType: 'image/webp' // Convertit en WebP pour un gain énorme
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
    return compressedFile;
  } catch (error) {
    console.error("Erreur lors de la compression de l'image:", error);
    // En cas d'échec, on renvoie le fichier original pour ne pas bloquer l'upload
    return file;
  }
};
