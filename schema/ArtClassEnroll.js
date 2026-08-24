import mongoose from "mongoose";

const classRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    studyBackground: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 5,
      max: 100,
    },

    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    classType: {
      type: String,
      enum: [
        "Saturday & Sunday – ₹499/class",
        "Regular Class – ₹799/class",
      ],
      required: true,
    },

    drawingLevel: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      required: true,
    },

    learningGoals: {
      type: [String],
      enum: [
        "Basic Drawing & Sketching",
        "Portrait Drawing",
        "Realistic Shading",
        "Face Proportions & Features",
        "Commission Work",
      ],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message:
          "At least one learning goal is required",
      },
    },

    // heardFrom: {
    //   type: String,
    //   enum: [
    //     "Instagram",
    //     "Youtube",
    //     "WhatsApp",
    //     "Friends",
    //     "Other",
    //   ],
    //   required: true,
    // },

    fee: {
      type: Number,
      enum: [499, 799],
      required: true,
    },

    paymentScreenshot: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Verified",
        "Rejected",
      ],
      default: "Pending",
    },

    registrationStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Cancelled",
      ],
      default: "Pending",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClassRegistration = mongoose.model(
  "ClassRegistration",
  classRegistrationSchema
);

export default ClassRegistration;