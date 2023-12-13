const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
    },

    courseDescription: {
      type: String,
    },

    whatYouWillLearn: {
      type: String,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
      },
    ],

    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingAndReview",
      },
    ],

    price: {
      type: Number,
    },

    thumbnail: {
      type: String,
    },

    tag: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    instructions: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("course", courseSchema);
