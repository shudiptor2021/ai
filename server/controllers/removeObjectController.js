import Content from "../models/aiContent.model.js";
import { v2 as cloudinary } from "cloudinary";


export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

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

    if (!object) {
      return res.status(400).json({
        success: false,
        message: "Object to remove is required",
      });
    }

    // upload original image
    const { public_id } = await cloudinary.uploader.upload(image.path);
    // Generate AI object removal URL
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      format: "jpg",
      resource_type: "image",
    });

    const data = {
      user_id: userId,
      prompt: `Remove ${object} from image`,
      content: imageUrl,
      type: "image",
    };

    // database
    await Content.create(data);

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};