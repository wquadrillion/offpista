import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
  origin: true, // Allow all origins for local development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

import authRoutes from './routes_auth.js';
import taskRoutes from './routes_tasks.js';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Task Manager API running.'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
