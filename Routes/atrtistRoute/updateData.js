import express from 'express';
import { updateArtistData } from '../../Controllers/artistData.js';
import { updateArtwork } from '../../Controllers/artwork.js';
import { uploadImageMulter } from '../../middleware/upload.js';
import { updateExhibition } from '../../Controllers/exhibition.js';
import { UpdatePaymentHandler } from '../../Controllers/artClassHandler.js';
// import { createExhibition } from '../../Controllers/exhibition.js';
// import { collabAdd } from '../../Controllers/collab.js';

const router = express.Router();


router.put('/artistDetails/:id', 
    uploadImageMulter.fields([
            {name: 'profileImage', maxCount: 1},
            {name: 'coverImage', maxCount: 1},
        ]),  
    updateArtistData 
);

router.put('/artworks/:id', 
    uploadImageMulter.array('images', 5), 
    updateArtwork
);

router.put('/exhibition/:id',
    uploadImageMulter.fields([
        { name: 'certificate', maxCount: 1 },
        { name: 'eventImages', maxCount: 5 }
    ]), 
    updateExhibition
)

// router.put('/art/enroll/update', UpdatePaymentHandler);
router.patch(
  "/art/enroll/class/payment/:paymentStatus/:enroll_id",
  UpdatePaymentHandler
);

export default router;