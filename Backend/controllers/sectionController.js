const section = require("../models/section");
const course = require("../models/course");
const subSection = require("../models/subSection");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await course.findById(courseId);
    if (!courseDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Course not found",
      });
    }
    console.log(courseDetails.instructor, userId);
    if (courseDetails.instructor.toString() !== userId.toString()) {
      return res.status(400).json({
        status: "fail",
        message: "You are not authorized to create section",
      });
    }
    const newSection = await section.create({
      sectionName,
      courseId,
    });
    const updatedCourse = await course
      .findByIdAndUpdate(
        courseId,
        {
          $push: { courseContent: newSection._id },
        },
        { new: true }
      )
      .populate({ path: "courseContent", populate: { path: "subSections" } });

    res.status(200).json({
      status: "success",
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName } = req.body;
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide sectionId and sectionName",
      });
    }

    const sectionDetails = await section.findById(sectionId);
    if (!sectionDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Section not found",
      });
    }

    const updatedSection = await section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Section updated successfully",
      updatedSection,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.body;
    if (!sectionId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide sectionId",
      });
    }

    const sectionDetails = await section.findById(sectionId);
    if (!sectionDetails) {
      return res.status(400).json({
        status: "fail",
        message: "Section not found",
      });
    }

    await section.findByIdAndDelete(sectionId);
    //delete section from courseContent
    await course.findByIdAndUpdate(sectionDetails.courseId, {
      $pull: { courseContent: sectionId },
    });
    //delete subSections
    await subSection.deleteMany({ sectionId: sectionId });
    res.status(200).json({
      status: "success",
      message: "Section deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
