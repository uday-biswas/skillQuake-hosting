const subSection = require("../models/subSection");
const section = require("../models/section");
const { imageUploader } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    const video = req.files.videoFile;
    //validation
    if (!title || !timeDuration || !description || !sectionId || !video) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all the details",
      });
    }

    const sectionDetails = await section.findById(sectionId);
    if (!sectionDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Section not found",
      });
    }
    //video upload
    const videoFile = await imageUploader(video, "skillQuake/videos/");
    //create subSection
    const newSubSection = await subSection.create({
      title,
      timeDuration,
      description,
      sectionId,
      videoUrl: videoFile.secure_url,
    });

    //update section details
    const updatedSection = await section
      .findByIdAndUpdate(
        sectionId,
        {
          $push: { subSections: newSubSection._id },
        },
        { new: true }
      )
      .populate("subSections");

    res.status(200).json({
      status: "success",
      message: "SubSection created successfully",
      updatedSection,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.body;
    let video;
    if (req.files) {
      video = req.files.videoFile;
      const videoFile = await imageUploader(video, "skillQuake/videos");
      req.body.videoUrl = videoFile.secure_url;
    }

    const subSectionDetails = await subSection.findById(subSectionId);
    if (!subSectionDetails) {
      return res.status(400).json({
        status: "fail",
        message: "SubSection not found",
      });
    }

    const updatedSubSection = await subSection.findByIdAndUpdate(
      subSectionId,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "SubSection updated successfully",
      updatedSubSection,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId } = req.body;
    if (!subSectionId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide subSectionId",
      });
    }

    const subSectionDetails = await subSection.findById(subSectionId);
    if (!subSectionDetails) {
      return res.status(400).json({
        status: "fail",
        message: "SubSection not found",
      });
    }

    await subSection.findByIdAndDelete(subSectionId);
    await section.findByIdAndUpdate(subSectionDetails.sectionId, {
      $pull: { subSections: subSectionId },
    });

    res.status(200).json({
      status: "success",
      message: "SubSection deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
