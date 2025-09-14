import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
import classroomRoutes from './routes/classroomRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

const app = express();
const port = process.env.PORT || 4000
connectDB();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.get('/',(req, res) => res.send("API Working!!!"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
app.use('/api/classrooms', classroomRoutes);
app.use('/api/announcements', announcementRoutes);
app.listen(port, ()=> console.log(`Server started on PORT: ${port}`))