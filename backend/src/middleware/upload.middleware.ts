import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// New homework submission directory
const homeworkDir = path.join(uploadDir, 'homework');
if (!fs.existsSync(homeworkDir)) {
  fs.mkdirSync(homeworkDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Use memory storage for sharp processing

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'text/csv'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and CSV are allowed.'), false);
  }
};

// Generic upload middleware
export const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Allow up to 10MB initially
  },
});

/**
 * Middleware to compress and save images (Supports multiple files)
 * @param type 'profile' or 'homework' or 'logo'
 */
export const processImages = (type: 'profile' | 'homework' | 'logo') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Handle both single (req.file) and multiple (req.files)
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : (req.file ? [req.file] : []);
    
    if (files.length === 0 || files[0].mimetype === 'text/csv') return next();

    const processedFiles: any[] = [];
    const targetDir = type === 'homework' ? homeworkDir : uploadDir;

    try {
      for (const file of files) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${type}-${uniqueSuffix}.webp`;
        const outputPath = path.join(targetDir, filename);

        await sharp(file.buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);

        processedFiles.push({
          filename,
          path: outputPath,
          relativePath: type === 'homework' ? `/uploads/homework/${filename}` : `/uploads/${filename}`
        });
      }

      // Add file information back to req object
      (req as any).processedFiles = processedFiles;
      if (processedFiles.length > 0) {
        (req as any).processedFile = processedFiles[0]; // Compatibility for single upload logic
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Keep old name for compatibility where only one file is expected
export const processImage = processImages;
