import { clerkClient } from "@clerk/express";
import Content from "../models/aiContent.model.js";
import AI from "../config/ai.js";
import { articleJoiSchema } from "../validators.js/aiContentValidator.js";

// article generator controller
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    // const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // Validate request first
    const { error, value } = articleJoiSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { prompt, length } = value;

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
        { role: "system", content: "You are a professional article writer." },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: length,
    });

    // console.log(response.choices[0].message);
    const content = response?.choices[0]?.message?.content;

    const data = {
      user_id: userId,
      prompt,
      content,
      type: "article",
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
    res.status(200).json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
