import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import './services/schedulerService.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'whatsx-backend' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/templates', templateRoutes);
app.use('/messages', messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`WhatsX backend running on :${env.port}`);
});
