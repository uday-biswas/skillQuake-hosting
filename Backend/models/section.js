const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    trim: true,
  },
  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "subSection",
    },
  ],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
});

module.exports = mongoose.model("section", sectionSchema);
