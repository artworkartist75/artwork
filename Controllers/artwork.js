import artwork from '../schema/Artwork.js';
import Artist from '../schema/ArtistSchema.js';
import { resizeImages } from '../utils/resize.js';
import { uploadMultipleImages } from '../middleware/cloudUpload.js';
import { generateUniqueSlug } from '../utils/generateSlug.js';

export const artworkAdd = async (req, res) => {
    try {
        console.log("Files received:", req.files);
        console.log("Artwork Data:", req.body);
        const id = "6a4a3718a44edb6e01aa4262";
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
        const slug = await generateUniqueSlug(req.body.title);
        //save to database
        const newArtwork = new artwork({
            artist:id,
            slug,
            ...req.body,
            "artworkImages":imageUrls
        });
        console.log("New Artwork Data to be saved:", newArtwork);
        await newArtwork.save();
        
        await Artist.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    featuredArtwork: newArtwork._id,
                },
            }
        );

        res.status(201).json({ message: 'Artwork data added successfully', data: newArtwork });
    }
    catch (error) {
        console.error('Error adding artwork data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getArtWork = async ( req, res ) => {
    try {
        const art = await artwork.find();
        res.status(200).json({
            message : "Artwork fetched!",
            data:art
        })
        
    } catch (error) {
        console.error("error fetch artwork",error);
        res.status(500).json({
            message:"internal server error"
        })
    }
}

export const updateArtwork = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = {
      ...req.body,
    };

    // Update slug if title changes
    if (updateData.title) {
      updateData.slug = await generateUniqueSlug(updateData.title);
    }

    // Upload new images only if provided
    if (req.files && req.files.length > 0) {
      const resizedImages = await resizeImages(req.files);

      const uploadedImages = await uploadMultipleImages(
        resizedImages,
        "artwork"
      );

      updateData.artworkImages = uploadedImages.map((image) => ({
        url: image.secure_url,
        publicId: image.public_id,
      }));
    }

    // Convert comma-separated strings to arrays if needed
    if (updateData.tags) {
      updateData.tags = updateData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const updatedArtwork = await artwork.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedArtwork) {
      return res.status(404).json({
        message: "Artwork not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Artwork updated successfully",
      data: updatedArtwork,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};