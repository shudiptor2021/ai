import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateArticle } from "../controllers/articleController.js";
import { upload } from "../config/multer.js";
import { generateBlogTitle } from "../controllers/blogTitleController.js";
import { generateImage } from "../controllers/generateImageController.js";
import { removeImageBackground } from "../controllers/removeBackgroudController.js";
import { removeImageObject } from "../controllers/removeObjectController.js";
import { reviewResume } from "../controllers/reviewResumeController.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground);
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject);
aiRouter.post('/resume-review', upload.single('resume'), auth, reviewResume);


export default aiRouter;