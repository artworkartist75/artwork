import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Art Fair",
        "Exhibition",
        "Competition",
        "Workshop",
        "Seminar",
        "Festival"
      ],
      required: true,
    },

    organizer: String,

    venue: String,

    city: String,

    state: String,

    country: String,

    startDate: Date,

    endDate: Date,

    description: String,

    certificateImage: {
      url: String,
      publicId: String,
    },

    eventImages: [
      {
        url: String,
        publicId: String,
      }
    ],

    achievement: {
      type: String,
      default: "",
    },

    displayOrder: Number
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Exhibition", exhibitionSchema);