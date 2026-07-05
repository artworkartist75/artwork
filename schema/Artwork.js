import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
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

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Painting",
        "Sketch",
        "Digital Art",
        "Illustration",
        "Photography",
        "Sculpture",
        "Mixed Media",
      ],
      required: true,
    },

    artworkImages: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    artworkVideo: {
      url: String,
      publicId: String,
    },

    medium: {
      type: String,
      default: "",
    },

    dimensions: {
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: "cm",
      },
    },

    yearCreated: Number,

    tags: [String],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isForSale: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },

    views: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Artwork", artworkSchema);