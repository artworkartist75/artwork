import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads/' folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create folder if it doesn't exist
}

// Configure Multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

// Multer configuration for file size limit and file type validation
const uploadSizeConfig = {
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed.'));
  }
}

// Multer file upload handler for multiple files
// export const uploadImage = multer({
//   storage,
//   ...uploadSizeConfig
// }).fields([
//   {name: 'profileImage', maxCount: 1},{name: 'coverImage', maxCount: 1},
// ]);

// Multer file upload handler for single file
// export const uploadProductImages = multer({
//   storage,
//   ...uploadSizeConfig
// }).array('images', 5); // Field name and max number of files

export const uploadImageMulter = multer({
  storage,
  ...uploadSizeConfig
})