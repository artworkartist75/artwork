import artwork from '../schema/Artwork.js';
import Artist from '../schema/ArtistSchema.js';
import { resizeImages } from '../utils/resize.js';
import { deleteImageFromCloudinary, uploadMultipleImages } from '../middleware/cloudUpload.js';
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
    console.log("artwork id ", id);
    let updateData = {
      ...req.body,
    };
    const existingArtwork = await artwork.findById(id);
    let finalImages = [...existingArtwork.artworkImages];

    // console.log("data -> ",updateData);
    // Update slug if title changes
    if (updateData.title) {
      updateData.slug = await generateUniqueSlug(updateData.title);
      console.log("inside slug create : ",updateData.slug);
    }

    //if there deleted image in data then
    if(updateData.deletedImages){
      const deletedImages = JSON.parse(updateData.deletedImages);
      
      await Promise.all(
        deletedImages.map((publicId) =>
          deleteImageFromCloudinary(publicId)
        )
      );

      // Remove from DB
      finalImages = existingArtwork.artworkImages.filter(
        (img) => !deletedImages.includes(img.publicId)
      );

    }

    // Upload new images only if provided
    if (req.files && req.files.length > 0) {
      console.log("image have to upload", req.files);
      const resizedImages = await resizeImages(req.files);

      const uploadedImages = await uploadMultipleImages(
        resizedImages,
        "artwork"
      );

      const imgsupload = uploadedImages.map((image) => ({
        url: image.secure_url,
        publicId: image.public_id,
      }));

      //imgs are in db 
      finalImages.push(...imgsupload);
    } 

    // Convert comma-separated strings to arrays if needed
    if (updateData.tags) {
      updateData.tags = updateData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    updateData.artworkImages = finalImages;
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
    console.log("updated data : ", updatedArtwork);

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

export const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const artId = "6a4a3718a44edb6e01aa4262";
    const art = await artwork.findById(id);

    if (!art) {
      return res.status(404).json({
        success: false,
        message: "art not found",
      });
    }

    if(art.artworkImages){
      await Promise.all(
        art.artworkImages.map((publicId) =>
          deleteImageFromCloudinary(publicId)
        )
      );
    }

    await artwork.findByIdAndDelete(id);
    await Artist.findByIdAndUpdate( artId ,{
        $pull: {
          featuredArtwork: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Exhibition deleted successfully",
    });

  } catch (error) {
    console.error("Delete Exhibition Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getFeaturedArtWork = async (req,res) => {
  try {
    const artworks = await artwork.find({ isFeatured: true });

    res.status(200).json({
      success: true,
      data: artworks,
    });
  } catch (error) {
    console.error("messge",error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export const getArtWorkSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("slug ->", slug);
    const art = await artwork.findOne({ slug });
    console.log("artwork by slug ->", art);
    if (!art) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    res.status(200).json({
      success: true,
      data: art,
    });
  } catch (error) {
    console.error("Error fetching artwork by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
