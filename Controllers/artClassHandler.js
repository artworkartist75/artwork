import { uploadMultipleImages } from "../middleware/cloudUpload.js";
import { resizeImages } from "../utils/resize.js";
import ClassRegistration from "../schema/ArtClassEnroll.js";

export const enrollmentHandler = async (req, res) => {
    try{
        console.log("Files received:", req.files);
        console.log("Artist Data:", req.body);
        const paymentScreenshot = req.files.paymentScreenshot ? req.files.paymentScreenshot[0] : null;
        let enrollmentData  = {...req.body};
        let paymentPic = {};

        if (!paymentScreenshot || !enrollmentData) {
            return res.status(400).json({ message: 'Payment screenshot and enrollment data are required' });
        }

        if (typeof enrollmentData.learningGoals === "string") {
            try {
                enrollmentData.learningGoals = JSON.parse(enrollmentData.learningGoals);
            } catch (error) {
                return res.status(400).json({ message: 'learningGoals must be a valid JSON array' });
            }
        }

        if (!Array.isArray(enrollmentData.learningGoals)) {
            return res.status(400).json({ message: 'learningGoals must be an array' });
        }

        if (paymentScreenshot) {
            const resizedFiles = await resizeImages([paymentScreenshot]);
            const uploadedImage = await uploadMultipleImages(resizedFiles, 'PaymentScreenshots');
            console.log("upload -> ",uploadedImage);
            paymentPic = uploadedImage.map(
                (image) => ({ url: image.secure_url, publicId: image.public_id })
            );
            console.log("Payment : ", paymentPic);
        }

        const newEnrollment = new ClassRegistration({
            ...enrollmentData,
            paymentScreenshot: paymentPic[0]
        });
        await newEnrollment.save();
        console.log("new Enroll -> ",newEnrollment);

        return res.status(200).json({ 
            message: 'Enrollment successful', 
            enrollmentId: newEnrollment._id 
        });

    }catch(error){
        console.error('Error during enrollment handling:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const UpdatePaymentHandler = async (req, res) => {
  try {
    const { paymentStatus, enroll_id } = req.params;

    const checkEnroll = await ClassRegistration.findById(enroll_id);

    if (!checkEnroll) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Update payment status
    checkEnroll.paymentStatus = paymentStatus;

    // Update enrollment status
    if (paymentStatus === "Verified") {
      checkEnroll.enrollStatus = "confirmed";
    } else if (paymentStatus === "failed") {
      checkEnroll.enrollStatus = "payment_failed";
    } else {
      checkEnroll.enrollStatus = "pending";
    }

    await checkEnroll.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: checkEnroll,
    });
  } catch (error) {
    console.error("Update Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

export const getEnrolled = async ( req, res) => {
    try {
        const enroll = await ClassRegistration.find();
        console.log("get -> ",enroll);
        res.status(200).json({ message: 'Enroll data retrieved successfully', data: enroll });
    }
    catch (error) {
        console.error('Error retrieving Enroll data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}