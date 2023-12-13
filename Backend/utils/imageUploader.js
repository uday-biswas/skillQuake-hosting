const cloudinary = require("cloudinary").v2;

const imageUploader = async (file, folder, quality) => {
  try {
    const options = {
      folder: folder,
      resource_type: "auto",

      public_id: file.name.split(".")[0],
      use_filename: true,
      unique_filename: false,
    };

    if (quality) {
      options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = { imageUploader };
