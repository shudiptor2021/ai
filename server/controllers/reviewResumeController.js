import Content from "../models/aiContent.model.js";
import fs from "fs";
import { unlink } from "fs/promises";
import pdf from "pdf-parse-fork";
import AI from "../config/ai.js";


// Helper to delete a file safely
const deleteFile = async (filePath) => {
  try {
    await unlink(filePath);
  } catch (err) {
    console.error("Failed to delete file:", filePath, err.message);
  }
};
// review resume controller
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
      return res.status(400).json({
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
    try {
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
        max_completion_tokens: 3000,
      });

      // console.log(response.choices[0].message);
      aiResponse = response.choices[0].message.content;
    } catch (aiError) {
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

    res.status(200).json({ success: true, content: aiResponse });
  } catch (error) {
    console.log(error.message);
    if (resume) await deleteFile(resume.path); // cleanup on failure
    res.status(500).json({ success: false, message: error.message });
  }
};