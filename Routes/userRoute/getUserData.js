import express from 'express';
import { getArtistData } from '../../Controllers/artistData.js';
import { getArtWork, getFeaturedArtWork } from '../../Controllers/artwork.js';
import { getExhibition } from '../../Controllers/exhibition.js';
import { getYoutubeStats } from '../../Controllers/youTube.js';

const router = express.Router();


router.get('/artistDetails', getArtistData );
router.get('/artworks', getArtWork);
router.get('/exhibitions', getExhibition);
router.get('/featuredArtwork', getFeaturedArtWork);
router.get('/stats', getYoutubeStats);
// router.get('/collaborations', );

export default router;