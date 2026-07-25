import express from 'express';
import { getArtistData } from '../../Controllers/artistData.js';
import { getArtWork } from '../../Controllers/artwork.js';
import { getExhibition } from '../../Controllers/exhibition.js';

const router = express.Router();


router.get('/artistDetails', getArtistData );
router.get('/artworks', getArtWork);
router.get('/exhibitions', getExhibition);
// router.get('/collaborations', );

export default router;