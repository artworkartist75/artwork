import express from "express";
import {
  createClientReview,
//   getArtistReviews,
  getArtworkReviews,
  deleteArtworkReview,
  getAllReviews,
} from "../../../Controllers/clientReviewHandler.js";

const router = express.Router();

router.post("/", createClientReview);
router.get("/artwork/:artworkId", getArtworkReviews);
router.delete("/artwork/:artworkId/review/:reviewId", deleteArtworkReview);
router.get("/all", getAllReviews);
// router.get("/artist/:artistId", getArtistReviews);

export default router;