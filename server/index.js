import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import webhookRouter from './routes/webhookRoutes.js';


const app = express();
// db connect
await connectDB();
await connectCloudinary();


// middlewares
app.use('/api/webhook', webhookRouter)
// app.use(cors());
app.use(cors({origin: "https://genai-frontend-one.vercel.app"}));
app.use(express.json());
app.use(clerkMiddleware());


// Health check endpoint (add this!)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use('/api/v1/ai', requireAuth(), aiRouter);
app.use('/api/v1/user', requireAuth(), userRouter);

app.get('/', (req, res) => {
    res.send("api is working")
})

// default error handler
const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err.message });
};

app.use(errorHandler);

app.listen(5000, ()=> {
    console.log("Server on running on port 5000")
})