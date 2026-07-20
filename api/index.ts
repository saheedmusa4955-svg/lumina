import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import kycRoutes from './routes/kyc';
import adminRoutes from './routes/admin';
import notificationsRoutes from './routes/notifications';
import settingsRoutes from './routes/settings';
import cronRoutes from './cron';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cron', cronRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
