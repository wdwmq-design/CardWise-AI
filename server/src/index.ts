import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import advisorRouter from './routes/advisor.js';
import chatRouter from './routes/chat.js';
import comparisonRouter from './routes/comparison.js';
import cardsRouter from './routes/wallet.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration matching client dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Global API routes
app.use('/api/advisor', authMiddleware, advisorRouter);
app.use('/api/chat', authMiddleware, chatRouter);
app.use('/api/comparison', authMiddleware, comparisonRouter);
app.use('/api/cards', authMiddleware, cardsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Startup listener
app.listen(PORT, () => {
  console.log(`============================================`);
  console.log(`🚀 CardWise AI server running on port: ${PORT}`);
  console.log(`📡 Client origin whitelisted: http://localhost:5173`);
  console.log(`🧠 OpenAI API configuration: ${process.env.OPENAI_API_KEY ? 'Configured ✅' : 'Mock/Offline mode ⚠️'}`);
  console.log(`============================================`);
});
