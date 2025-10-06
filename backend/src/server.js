import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { initFirebaseAdmin } from './config/firebase.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';
import { startScheduler } from './services/schedulerService.js';

// Initialize Firebase Admin
initFirebaseAdmin();

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/templates', templateRoutes);
app.use('/messages', messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`WhatsX backend listening on http://localhost:${env.port}`);
  startScheduler();
});
