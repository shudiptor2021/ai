import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import webhookRouter from './routes/webhookRoutes.js';
import clerkWebhooks from './controllers/clerkWebhook.js';


const app = express();
// db connect
await connectDB();
await connectCloudinary();

// app.post(
//   "/api/clerk",
//   express.raw({ type: "application/json" }),
//   clerkWebhooks
// );

// middlewares
app.use('/api/webhook', webhookRouter)
app.use(cors());
// app.use(cors({origin: "https://hotel-booking-frontend-xi-hazel.vercel.app"}));
app.use(express.json());
app.use(clerkMiddleware());

app.use(requireAuth());

app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/user', userRouter);

app.listen(5000, ()=> {
    console.log("Server on running on port 5000")
})