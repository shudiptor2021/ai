import { clerkClient } from "@clerk/express";
import AI from "../config/ai.js";
import Content from "../models/aiContent.model.js";
import { blogTitleJoiSchema } from "../validators.js/aiContentValidator.js";

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    // const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Validate request first
    const { error, value } = blogTitleJoiSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { prompt } = value;

    // check usege limit
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free limit reached. Upgrade to premium.",
      });
    }

    // ai content generation
    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a professional blog writer. Generate 5 catchy SEO optimized blog titles based on the user's prompt.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // console.log(response.choices[0].message);
    const content = response.choices[0].message.content;

    const data = {
      user_id: userId,
      prompt,
      content,
      type: "blog title",
    };

    // save to database
    await Content.create(data);

    // update usage
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
