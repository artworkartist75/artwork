import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    profession: {
      type: String,
      default: "Artist",
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 1000,
    },

    shortBio: {
      type: String,
      maxlength: 150,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: String,
    state: String,
    country: String,

    website: {
      type: String,
      default: "",
    },

    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
      linkedin: String,
      behance: String,
      dribbble: String,
      pinterest: String,
      x: String,
    },

    skills: [
      {
        type: String,
      },
    ],

    specialties: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    languages: [
      {
        type: String,
      },
    ],

    resume: {
      type: String,
      default: "",
    },

    isAvailableForWork: {
      type: Boolean,
      default: true,
    },

    featuredArtwork: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artwork",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Artist", artistSchema);