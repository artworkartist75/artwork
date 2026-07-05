import Exhibition from '../schema/Exhibition.js';
import { resizeImages } from '../utils/resize.js';

export const createExhibition = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        
        const certificate = req.files.certificate?.[0];
        const eventImagesdata = req.files.eventImages || [];
        const certificateImage = {};
        const eventImages = [];

        if (certificate) {
            const certficateResized = await resizeImages([certificate]);
            const uploadedCertificate = await uploadMultipleImages(certficateResized, 'exhibition/certificate');
            if (!uploadedCertificate || uploadedCertificate.length === 0) {
                return res.status(400).json({ message: 'Certificate upload failed' });
            }
            certificateImage = uploadedCertificate.map(
               (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
            console.log("Uploaded certificate image:", certificateImage);
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
            console.log("Uploaded event images:", eventImages);
        }

        const exhibition = new Exhibition({
            ...req.body,
            certificate: certificateImage,
            eventImages: eventImages
        })

        console.log("Exhibition data to be saved:", exhibition);
        await exhibition.save();

        res.status(201).json({ message: 'Exhibition created successfully', exhibition });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
