class StorageService {
  constructor() {
    this.baseImagePath = '/images';
  }

  // Upload image
  async uploadImage(file, folder, id) {
    return new Promise((resolve, reject) => {
      // Validate file
      try {
        this.validateImageFile(file);
      } catch (error) {
        reject(error);
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const base64 = e.target.result;
          
          // Compress image
          const compressed = await this.compressImage(base64, 800, 0.8);
          
          // Generate filename
          const extension = file.type.split('/')[1];
          const filename = `${id}.${extension}`;
          const path = `${folder}/${filename}`;

          // Save locally
          await this.saveImageLocally(path, compressed);

          resolve(path);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Compress image
  async compressImage(base64, maxWidth, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Proportional resize
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
    });
  }

  // Save image locally (using localStorage for development)
  async saveImageLocally(path, base64) {
    try {
      // In production, this should call a backend API
      // For now, we'll use localStorage for demo purposes
      localStorage.setItem(`image_${path}`, base64);
      return path;
    } catch (error) {
      throw new Error('Erreur de sauvegarde de l\'image');
    }
  }

  // Get image URL
  getImageUrl(path) {
    if (!path) return `${this.baseImagePath}/placeholder.jpg`;

    // Try to get from localStorage first
    const stored = localStorage.getItem(`image_${path}`);
    if (stored) {
      return stored;
    }

    // Otherwise return the public path
    return `${this.baseImagePath}/${path}`;
  }

  // Delete image
  async deleteImage(path) {
    try {
      localStorage.removeItem(`image_${path}`);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Validate image file
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
    }

    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux (max 5 MB).');
    }

    return true;
  }

  // Get file info
  getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }

  // Create thumbnail
  async createThumbnail(file, maxSize = 200) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate thumbnail dimensions
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

export default new StorageService();

