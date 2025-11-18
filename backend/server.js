import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/auth.route.js';
import userRoutes from './src/routes/user.route.js';
import serviceRoutes from './src/routes/service.route.js';
import orderRoutes from './src/routes/order.route.js';
import reviewRoutes from './src/routes/review.route.js';
import walletRoutes from './src/routes/wallet.route.js';
import messageRoutes from './src/routes/message.route.js';
import { connectDB } from './src/lib/db.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://vinix-frontend.vercel.app', 'https://vinix.vercel.app']
      : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://vinix-frontend.vercel.app', 'https://vinix.vercel.app']
    : 'http://localhost:5173'
}));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);

// Socket handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', (data) => {
    io.to(data.conversationId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Vercel serverless function export
export default (req, res) => {
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    return app(req, res);
  }

  // Handle root path
  if (req.method === 'GET' && req.url === '/') {
    res.status(200).json({
      message: 'Vinix Freelance Platform API',
      version: '1.0.0',
      status: 'running'
    });
    return;
  }

  // Fallback
  res.status(404).json({ message: 'Not found' });
};