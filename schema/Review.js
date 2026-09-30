import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      // type: String,
      required: true,
    },

    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      default: null,
    },

    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },

    reviewerImage: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
      maxlength: 500,
    },
    //will change to false after admin approval
    isApproved: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);