const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  timeDuration: {
    type: Number,
  },
  videoUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
  },
});

module.exports = mongoose.model("subSection", subSectionSchema);
