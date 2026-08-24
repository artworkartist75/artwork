import express from "express";
import { enrollmentHandler } from "../../Controllers/artClassHandler.js";
import { uploadImageMulter } from "../../middleware/upload.js";

const router = express.Router();

router.post('/class/enrollment',
            uploadImageMulter.fields([
                {name: 'paymentScreenshot', maxCount: 1}
            ]), 
            enrollmentHandler
        );

export default router;