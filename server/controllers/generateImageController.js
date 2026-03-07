import Content from "../models/aiContent.model.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { imageJoiSchema } from "../validators.js/aiContentValidator.js";

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    // const { prompt, publish } = req.body;
    const plan = req.plan;

    // Validate request first
    const { error, value } = imageJoiSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { prompt, publish } = value;

    // check usege limit
    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium subscritions.",
      });
    }

    // ai image generation
    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    const mainData = {
      user_id: userId,
      prompt,
      content: secure_url,
      type: "image",
      publish,
    };

    // save to database
    await Content.create(mainData);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
