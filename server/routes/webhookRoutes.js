import express from "express";
import clerkWebhooks from "../controllers/clerkWebhook.js";


const webhookRouter = express.Router();

webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

export default webhookRouter;