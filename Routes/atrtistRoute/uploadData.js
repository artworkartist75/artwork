import express from 'express';
import { artistDataAdd } from '../../Controllers/artistData.js';
import { artworkAdd } from '../../Controllers/artwork.js';
import { uploadImageMulter } from '../../middleware/upload.js';
import { createExhibition } from '../../Controllers/exhibition.js';
import { collabAdd } from '../../Controllers/collab.js';

const router = express.Router();

router.post('/artistDetails', 
    uploadImageMulter.fields([
        {name: 'profileImage', maxCount: 1},
        {name: 'coverImage', maxCount: 1},
    ]), 
    artistDataAdd
);

router.post('/artworks', 
    uploadImageMulter.array('images', 5), 
    artworkAdd
);

router.post('/exhibitions',
    uploadImageMulter.fields([
        { name: 'certificate', maxCount: 1 },
        { name: 'eventImages', maxCount: 5 }
    ]),
    createExhibition
);

router.post('/collaborations',
    uploadImageMulter.single('companyLogo'),
    collabAdd
);

export default router;