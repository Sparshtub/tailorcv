import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import tailorRouter from './routes/tailor';
import exportRouter from './routes/export';
import templateRouter from './routes/template';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'AI Resume/Cover Letter Builder API is running.' });
});

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/tailor', tailorRouter);
app.use('/api/export', exportRouter);
app.use('/api/template', templateRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
