import Collab from '../schema/Collaboration.js';
import { resizeImages } from '../utils/resize.js';
import { uploadMultipleImages } from '../middleware/cloudUpload.js';

export const collabAdd = async (req, res) => {
    try {
        
        console.log("Files received:", req.files);
        console.log("collab Data:", req.body);

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }
        
        const imageResized = await resizeImages(req.files);//resized images
        const uploadedImages = await uploadMultipleImages(imageResized, 'collab');//uploaded images to cloudinary
        
        if (!uploadedImages || uploadedImages.length === 0) { //validate if images were uploaded successfully
            return res.status(400).json({ message: 'Image upload failed' });
        }
        console.log("uploadImages ->", uploadedImages);
        
        const companyLogo = uploadedImages.map(
            (image) => ({ url: image.secure_url, publicId: image.public_id })   
        );
        console.log("Uploaded Image URLs:", companyLogo);
        
        const newCollab = new Collab({ //save the data to the database
            ...req.body,
            "companyLogo": companyLogo
        });
        console.log("New Collaboration Data to be saved:", newCollab);
        await newCollab.save();
        res.status(201).json({ message: 'Collaboration data added successfully', data: newCollab });
    }
    catch (error) {
        console.error('Error adding collaboration data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};