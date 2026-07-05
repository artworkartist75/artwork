import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resize the image before uploading
async function resizeImage(filePath, outputFilePath, width = 800) {
  return sharp(filePath)
    .resize(width) // Resize to the desired width
    // .jpeg({ quality: 80 }) // Optional: set quality to 80%
    .toFormat('jpeg', { quality: 80 }) // Convert to JPEG with 80% quality
    .toFile(outputFilePath); // Output to a new file
}

async function uploadSingleImage(file, folder = 'products') {
  console.log("Resizing and uploading file to Cloudinary:", file.path);
  console.log("File details:", file);
  console.log("dir", __dirname);
  console.log("path", path.join(__dirname, '../uploads', 'resized_' + Date.now() + path.extname(file.originalname)));
  const resizedFilePath = path.join(__dirname, '../uploads', 'resized_' + Date.now() + path.extname(file.originalname));

  console.log("phle -> ",resizedFilePath);
  // Resize the image
  await resizeImage(file.path, resizedFilePath);
  console.log("bad me  -> ",await resizeImage(file.path, resizedFilePath));

  // Upload the resized image to Cloudinary
  const options = { folder };
  const result = await cloudinary.uploader.upload(resizedFilePath, options);

  // Clean up the resized file after uploading
  fs.unlinkSync(resizedFilePath);

  return result;
}

export async function uploadSingleImageToCloudinary (file, folder = 'Product') {
  try {
    const result = await uploadSingleImage(file, folder);
    console.log("Uploaded image to Cloudinary:", result);
    return await Promise.all(result);
  }catch (err) {
    console.error("Error uploading image:", err);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function uploadMultipleImages(files, folder = 'Products') {
  try {
    const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (err) {
    console.error("Error uploading images:", err);
    throw new Error('Failed to upload images to Cloudinary');
  }
}


export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};