import Content from "../models/aiContent.model.js";
import { v2 as cloudinary } from "cloudinary";
import { removeBgJoiSchema } from "../validators.js/aiContentValidator.js";

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    // Validate request first
    const { error } = removeBgJoiSchema.validate({
      file: req.file,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // check usege limit
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscritions.",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // remove image background
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
      format: "png",
    });

    const data = {
      user_id: userId,
      prompt: "Remove background from image",
      content: secure_url,
      type: "image",
    };

    // save to database
    await Content.create(data);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
