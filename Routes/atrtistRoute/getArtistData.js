import express from 'express';
import { getArtistData, updateArtistData } from '../../Controllers/artistData.js';
import { uploadImageMulter } from "../../middleware/upload.js";
import { getArtWork } from '../../Controllers/artwork.js';


const router = express.Router();

router.get('/artistDetails', getArtistData );

router.get('/artworks', getArtWork);

// router.get('/collaborations', );
// router.get('/exhibitions', );

export default router;