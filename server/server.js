import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';

dotenv.config(); // load environment variable
connectDB(); // connect to mongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable cors

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
