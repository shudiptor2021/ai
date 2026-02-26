import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';


const app = express();
// db connect
await connectDB();
await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res)=> {
    res.send('server is live')
});

app.use(requireAuth());

app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/user', userRouter);

app.listen(5000, ()=> {
    console.log("Server on running on port 5000")
})