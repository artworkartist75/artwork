import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_WIDTH = 755;
const REQUIRED_HEIGHT = 855;

export const resizeImages = async (files) => {
  const resizedFiles = [];
  console.log("Files to be resized:", files);
  for (let file of files) {
    const outputPath = path.join(__dirname, `../uploads/resized-${Date.now()}-${file.originalname}`);

    await sharp(file.path)
      .resize(REQUIRED_WIDTH, REQUIRED_HEIGHT, { fit: 'cover' })
      .toFile(outputPath);

    resizedFiles.push({ path: outputPath, originalname: file.originalname });

    fs.unlinkSync(file.path); // Remove original multer temp file
  }

  return resizedFiles;
};