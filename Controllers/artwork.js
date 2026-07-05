import artwork from '../schema/Artwork.js';
import { resizeImages } from '../utils/resize.js';
import { uploadMultipleImages } from '../middleware/cloudUpload.js';

export const artworkAdd = async (req, res) => {
    try {
        console.log("Files received:", req.files);
        console.log("Artwork Data:", req.body);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }
        //resized images
        const imageResized = await resizeImages(req.files);
        //upload to cloudinary
        const uploadedImages = await uploadMultipleImages(imageResized, 'artwork');
        //validate if images were uploaded successfully
        if (!uploadedImages || uploadedImages.length === 0) {
            return res.status(400).json({ message: 'Image upload failed' });
        }
        console.log("uploadImages ->", uploadedImages);
        //get url from cloudinary
        const imageUrls = uploadedImages.map(
            (image) => ({ url: image.secure_url, publicId: image.public_id })
        );
        console.log("Uploaded Image URLs:", imageUrls);
        //save to database
        const newArtwork = new artwork({
            ...req.body,
            "artworkImages":imageUrls
        });
        console.log("New Artwork Data to be saved:", newArtwork);
        await newArtwork.save();
        res.status(201).json({ message: 'Artwork data added successfully', data: newArtwork });
    }
    catch (error) {
        console.error('Error adding artwork data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};