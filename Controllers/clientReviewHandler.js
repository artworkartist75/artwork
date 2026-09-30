import mongoose from "mongoose";
import Review from "../schema/Review.js";
import Artist from "../schema/ArtistSchema.js";
import Artwork from "../schema/Artwork.js";

export const createClientReview = async (req, res) => {
  try {
    const {
      artist,
      artwork = null,
      reviewerName,
      reviewerImage = "",
      rating,
      review,
    } = req.body;

    if (!artist || !reviewerName || rating === undefined || !review) {
      return res.status(400).json({
        success: false,
        message: "artist, reviewerName, rating and review are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(artist)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist ID",
      });
    }

    if (artwork && !mongoose.Types.ObjectId.isValid(artwork)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artwork ID",
      });
    }

    const artistExists = await Artist.findById(artist);

    if (!artistExists) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    if (artwork) {
      const artworkExists = await Artwork.findById(artwork);

      if (!artworkExists) {
        return res.status(404).json({
          success: false,
          message: "Artwork not found",
        });
      }
    }

    const newReview = await Review.create({
      artist,
      artwork,
      reviewerName,
      reviewerImage,
      rating,
      review,
      isApproved: true,
    });

    if (artwork) {
      await Artwork.findByIdAndUpdate(artwork, {
        $addToSet: { reviews: newReview._id },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted and waiting for approval",
      data: newReview,
    });
  } catch (error) {
    console.error("Create client review error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// export const getArtistReviews = async (req, res) => {
//   try {
//     const { artistId } = req.params;

//     const reviews = await Review.find({
//       artist: artistId,
//       isApproved: true,
//     })
//       .populate("artwork", "title slug artworkImages")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: reviews.length,
//       data: reviews,
//     });
//   } catch (error) {
//     console.error("Get artist reviews error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const getArtworkReviews = async (req, res) => {
  try {
    const { artworkId } = req.params;

    const reviews = await Review.find({
      artwork: artworkId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((total, item) => total + item.rating, 0) /
          reviews.length
        : 0;

    return res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      data: reviews,
    });
  } catch (error) {
    console.error("Get artwork reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteArtworkReview = async (req, res) => {
  try {
    const { artworkId, reviewId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(artworkId) ||
      !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid artwork ID or review ID",
      });
    }

    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      artwork: artworkId,
    });

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found for this artwork",
      });
    }

    await Artwork.findByIdAndUpdate(artworkId, {
      $pull: { reviews: deletedReview._id },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error) {
    console.error("Delete artwork review error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("artist", "name")
      .populate("artwork", "title slug artworkImages")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
