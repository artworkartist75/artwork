import { deleteImageFromCloudinary, uploadMultipleImages } from '../middleware/cloudUpload.js';
import Exhibition from '../schema/Exhibition.js';
import { generateUniqueSlug } from '../utils/generateSlug.js';
import { resizeImages } from '../utils/resize.js';

export const createExhibition = async (req, res) => {
    try {        
        const certificate = req.files.certificate?.[0];
        const eventImagesdata = req.files.eventImages || [];
        let certificateImage = {};
        let eventImages = [];

        if (certificate) {
            const certficateResized = await resizeImages([certificate]);
            console.log("certificate resized : ", certficateResized);
            const uploadedCertificate = await uploadMultipleImages(certficateResized, 'exhibition/certificate');
            if (!uploadedCertificate || uploadedCertificate.length === 0) {
                return res.status(400).json({ message: 'Certificate upload failed' });
            }
            certificateImage = uploadedCertificate.map(
               (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
        }

        if(eventImagesdata.length > 0) {
            const eventImagesResized = await resizeImages(eventImagesdata);
            const uploadedEventImages = await uploadMultipleImages(eventImagesResized, 'exhibition/eventImages');
            if (!uploadedEventImages || uploadedEventImages.length === 0) {
                return res.status(400).json({ message: 'Event images upload failed' });
            }
            eventImages = uploadedEventImages.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
        }

        const exhibition = new Exhibition({
            ...req.body,
            certificateImage: certificateImage[0],
            eventImages: eventImages
        })

        console.log("Exhibition data to be saved:", exhibition);
        await exhibition.save();

        res.status(201).json({ message: 'Exhibition created successfully', exhibition });

    } catch (error) {
        console.error("error at exhibition add : ",error);
        res.status(400).json({ message: error.message });
    }
};

export const getExhibition = async (req,res) => {
    try {
        const exhi = await Exhibition.find();
        res.status(200).json({
            message : "Exhibition fetched!",
            data:exhi
        })
    } catch (error) {
        console.error("error fetch exhibition",error);
        res.status(500).json({
            message:"internal server error"
        })
    }
}

export const deleteExhibition = async (req, res) => {
  try {
    const { id } = req.params;

    const exhibition = await Exhibition.findById(id);

    if (!exhibition) {
      return res.status(404).json({
        success: false,
        message: "Exhibition not found",
      });
    }

    // Delete certificate
    if (exhibition.certificateImage?.publicId) {
      await Promise.all( deleteImageFromCloudinary(exhibition.certificateImage.publicId));
    }

    if(exhibition.eventImages){
      await Promise.all(
        exhibition.eventImages.map((publicId) =>
          deleteImageFromCloudinary(publicId)
        )
      );
    }

    await Exhibition.findByIdAndDelete(id);

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

export const updateExhibition = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Exhibition id ", id);
    let updateData = {...req.body};
    const existingExhibition = await Exhibition.findById(id);
    let certificateImg = [existingExhibition.certificateImage];
    let eventImg = [...existingExhibition.eventImages];

    // console.log("data -> ",updateData);
    // Update slug if title changes
    if (updateData.title) {
      updateData.slug = await generateUniqueSlug(updateData.title);
    }

    //if there event deleted image in data then
    if(updateData.deleteEventImg.length > 0){
      const deletedImages = JSON.parse(updateData.deleteEventImg); 
      await Promise.all(
        deletedImages.map((publicId) =>
          deleteImageFromCloudinary(publicId)
        )
      );

      // Remove from DB
      eventImg = existingExhibition.eventImages.filter(
        (img) => !deletedImages.includes(img.publicId)
      );
    }

    if(updateData.deleteCertificate){
      await deleteImageFromCloudinary(updateData.deleteCertificate);
      //only one image exist so no need to remove 
      certificateImg = [];
    }

    const certificate = req.files.certificate?.[0];
    const eventImagesdata = req.files.eventImages || [];

    if (certificate) {
        const certficateResized = await resizeImages([certificate]);
        const uploadedCertificate = await uploadMultipleImages(certficateResized, 'exhibition/certificate');
        if (!uploadedCertificate || uploadedCertificate.length === 0) {
            return res.status(400).json({ message: 'Certificate upload failed' });
        }
        const certificateImage = uploadedCertificate.map(
           (image) => ({ url: image.secure_url, publicId: image.public_id })
        );
        certificateImg.push(...certificateImage);
    }

    if(eventImagesdata.length > 0) {
        const eventImagesResized = await resizeImages(eventImagesdata);
        const uploadedEventImages = await uploadMultipleImages(eventImagesResized, 'exhibition/eventImages');
        if (!uploadedEventImages || uploadedEventImages.length === 0) {
            return res.status(400).json({ message: 'Event images upload failed' });
        }
        const eventImages = uploadedEventImages.map(
            (image) => ({ url: image.secure_url, publicId: image.public_id })
        );
        eventImg.push(...eventImages);
    }
    updateData.eventImages = eventImg;
    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      id,
      {
        ...updateData,
        certificateImage: certificateImg[0],
        eventImages: eventImg
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedExhibition) {
      return res.status(404).json({
        message: "Exhibition not found",
      });
    }
    console.log("updated data : ", updatedExhibition);

    return res.status(200).json({
      success: true,
      message: "Exhibition updated successfully",
      data: updatedExhibition,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};