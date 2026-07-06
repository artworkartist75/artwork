import express from 'express';
import { updateArtistData } from '../../Controllers/artistData.js';
import { updateArtwork } from '../../Controllers/artwork.js';
import { uploadImageMulter } from '../../middleware/upload.js';
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


export default router;