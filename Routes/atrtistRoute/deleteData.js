import express from 'express';
import { deleteExhibition } from '../../Controllers/exhibition.js';
import { deleteArtwork } from '../../Controllers/artwork.js';

const router = express.Router();

router.delete('/artwork/:id',deleteArtwork);
router.delete('/exhibition/:id',deleteExhibition);

export default router;