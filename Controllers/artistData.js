import artistData from '../schema/ArtistSchema.js';
import { resizeImages } from '../utils/resize.js';
import { uploadMultipleImages } from '../middleware/cloudUpload.js';


export const artistDataAdd = async (req, res) => {
    try {
        console.log("Files received:", req.files);
        console.log("Artist Data:", req.body);
        const profileImage = req.files.profileImage ? req.files.profileImage[0] : null;
        const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
        let profileImg = {};
        let coverImg = {};

        if (!profileImage || !coverImage) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // const resizedFiles = await resizeImages([profileImage, coverImage]);
        // const uploadedImage = await uploadMultipleImages(resizedFiles, 'ArtistImages');
        // const successfullUpload = uploadedImage.filter(img => img !== null);
        // if(successfullUpload.length === 0) {
        //     return res.status(400).json({ message: 'Failed to upload image to Cloudinary' });
        // }
        // const imageUrl = successfullUpload.map(img => img.secure_url);

        if(profileImage){
            const profileResized = await resizeImages([profileImage]);
            onsole.log("certificate resized : ", profileResized);
            const uploadedProfile = await uploadMultipleImages(certficateResized, 'Artist/Profile');
            if (!uploadedProfile || uploadedProfile.length === 0) {
                return res.status(400).json({ message: 'Profile upload failed' });
            }
            profileImg = uploadedProfile.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
            console.log("Uploaded profile image:", profileImg);
        }

        if(coverImage){
            const coverResized = await resizeImages([coverImage]);
            console.log("cover resized : ", coverResized);
            const uploaded = await uploadMultipleImages(coverResized, 'Artist/cover');
            if (!uploaded || uploaded.length === 0) {
                return res.status(400).json({ message: 'Cover upload failed' });
            }
            coverImg = uploaded.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
            console.log("Uploaded profile image:", coverImg);
        }
        

        if(req.body.skills){
            req.body.skills = req.body.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if(req.body.specialties){
            req.body.specialties = req.body.specialties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if(req.body.languages){
            req.body.languages = req.body.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if (req.body.socialLinks) {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        }
        console.log("socialLink ",req.body);

        const newArtistData = new artistData({
            ...req.body,
            socialLinks: req.body.socialLinks,
            profileImage: profileImg, // Assuming you want to store the first uploaded image URL
            coverImage: coverImg // Assuming you want to store the second uploaded image URL
        });
        console.log("New Artist Data to be saved:", newArtistData);
        await newArtistData.save();
        res.status(201).json({ 
            message: 'Artist data added successfully!', 
            data: newArtistData,
            status: "success" 
        });
    } catch (error) {
        console.error('Error adding artist data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getArtistData = async (req, res) => {
    try {
        const artistDataList = await artistData.find();
        res.status(200).json({ message: 'Artist data retrieved successfully', data: artistDataList });
    }
    catch (error) {
        console.error('Error retrieving artist data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateArtistData = async (req, res) => {
    try{
        // console.log("Files received:", req.files);
        // console.log("Artist Data:", req.body);
        const { id } = req.params;
        let updateData  = {...req.body};
        
        const profileImage = req.files.profileImage ? req.files.profileImage[0] : null;
        const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
        let imageUrl = null;

        if(req.body.skills){
            updateData.skills = req.body.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if(req.body.specialties){
            updateData.specialties = req.body.specialties
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if(req.body.languages){
            updateData.languages = req.body.languages
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        if (req.body.socialLinks) {
            updateData.socialLinks = JSON.parse(req.body.socialLinks);
        }

        if (profileImage) {
            const resizedFiles = await resizeImages([profileImage]);            
            const uploadedImage = await uploadMultipleImages(resizedFiles, 'ArtistImages');
            const successfullUpload = uploadedImage.filter(img => img !== null);
            if(successfullUpload.length === 0) {
                return res.status(400).json({ message: 'Failed to upload image to Cloudinary' });
            }
            updateData.profileImage = successfullUpload.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
        }
        if (coverImage) {
            const resizedFiles = await resizeImages([coverImage]);            
            const uploadedImage = await uploadMultipleImages(resizedFiles, 'coverImage');
            const successfullUpload = uploadedImage.filter(img => img !== null);
            if(successfullUpload.length === 0) {
                return res.status(400).json({ message: 'Failed to upload image to Cloudinary' });
            }
            updateData.coverImage = successfullUpload.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
        } 

        const updateArtist = await artistData.findByIdAndUpdate(
            id, 
            updateData, {
            returnDocument: "after",
            runValidators: true,
        });
        res.status(200).json({
            message : "Artist data Update Successfully!",
            data: updateArtist,
            status: "success"
        })
    }catch(error){
        console.error('Error adding artist data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};