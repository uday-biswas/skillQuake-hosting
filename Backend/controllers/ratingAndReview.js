const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const mongoose = require("mongoose");

//createRating
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //fetchdata from req body
    const { rating, review, courseId } = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    //check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      userId: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      userId: userId,
    });

    //update course with this rating/review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created Successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    //get course ID
    const { courseId } = req.body;
    //calculate avg rating

    const updatedCourseId = new mongoose.Types.ObjectId(courseId);
    console.log(updatedCourseId);
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: updatedCourseId,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    console.log(result);

    //return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    //if no rating/Review exist
    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find()
      .sort({ rating: "desc" })
      .populate({
        path: "userId",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      });
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //fetchdata from req body
    const { courseId } = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }
    //check if user reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      userId: userId,
      course: courseId,
    });
    if (!alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is not reviewed by the user",
      });
    }
    //update rating and review
    const ratingReview = await RatingAndReview.findOneAndUpdate(
      {
        userId: userId,
        course: courseId,
      },
      req.body,
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review updated Successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
