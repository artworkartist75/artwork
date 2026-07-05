import mongoose from "mongoose";

const collaborationSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 500,
    },

    companyName: {
      type: String,
      default: "",
    },

    companyLogo: {
      url: String,
      publicId: String,
    },

    website: {
      type: String,
      default: "",
    },

    startDate: Date,

    endDate: Date,

    isCurrent: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collaboration", collaborationSchema);