import express from 'express';
import { getArtistData, updateArtistData } from '../../Controllers/artistData.js';
import { uploadImageMulter } from "../../middleware/upload.js";


const router = express.Router();

router.get('/get/artistDetails', getArtistData );
router.put('/update/artistDetails/:id', 
    uploadImageMulter.fields([
            {name: 'profileImage', maxCount: 1},
            {name: 'coverImage', maxCount: 1},
        ]),  
    updateArtistData 
);
// router.get('/collaborations', );
// router.get('/artworks', );
// router.get('/exhibitions', );

export default router;