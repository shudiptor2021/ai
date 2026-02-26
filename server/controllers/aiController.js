import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import Content from "../models/aiContent.model.js";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse-fork";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// article generator controller
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    // ai content generation
    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: length,
    });

    // console.log(response.choices[0].message);
    const content = response.choices[0].message.content;

    const data = {
      user_id: userId,
      prompt,
      content,
      type: "article",
    };

    // database
    await Content.create(data);

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

// blog-title generator controller
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    // ai content generation
    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
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

    // database
    await Content.create(data);

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

// image generator controller
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
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

    // database
    await Content.create(mainData);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// image-background removal controller
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscritions.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

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

    // database
    await Content.create(data);

    res.json({ success: true, data: data });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// image object removal controller
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

    if (!req.file) {
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

    res.json({ success: true, data: data });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// review resume controller

// Helper to delete a file safely
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error("Failed to delete file:", filePath, err.message);
  }
};

export const reviewResume = async (req, res) => {
      const resume = req.file;
  try {
    const { userId } = req.auth();

    const plan = req.plan;

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium subscritions.",
      });
    }

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Resume file size exceds allowed size (5MB)",
        });
    }

// Validate MIME type
     if (resume.mimetype !== "application/pdf") {
      await deleteFile(resume.path);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only PDF files are allowed.",
      });
    }

    const dataBuffer = await fs.promises.readFile(resume.path);
    const pdfData = await pdf(dataBuffer);
    await deleteFile(resume.path); // clean up immediately

     // Truncate text to prevent huge AI prompts
    const resumeText = pdfData.text.slice(0, 8000); // adjust depending on model tokens

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${resumeText}`;

    // ai content generation
    let aiResponse;
   try{ const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 1000,
    });

    // console.log(response.choices[0].message);
     aiResponse = response.choices[0].message.content;
  }catch(aiError){
     console.error("AI error:", aiError.message);
      return res.status(502).json({
        success: false,
        message: "Failed to generate resume feedback. Please try again later.",
      });
  }

    const data = {
      user_id: userId,
      prompt: "Review the uploaded resume",
      content: aiResponse,
      type: "resume-review",
    };

    // database
    await Content.create(data);

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(error.message);
     if (resume) await deleteFile(resume.path); // cleanup on failure
    res.status(500).json({ success: false, message: error.message });
  }
};
