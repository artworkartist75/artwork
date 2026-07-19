import express from 'express';
import { getArtistData, updateArtistData } from '../../Controllers/artistData.js';
import { uploadImageMulter } from "../../middleware/upload.js";
import { getArtWork } from '../../Controllers/artwork.js';
import { getExhibition } from '../../Controllers/exhibition.js';


const router = express.Router();

router.get('/artistDetails', getArtistData );

router.get('/artworks', getArtWork);

// router.get('/collaborations', );
router.get('/exhibitions', getExhibition);

export default router;