import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './db.js';
import { requireAuth } from './middleware/auth.js';
import { uploadsDir } from './routes/photos.js';
import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import bookingsRoutes from './routes/bookings.js';
import photosRoutes from './routes/photos.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', requireAuth, roomsRoutes);
app.use('/api/bookings', requireAuth, bookingsRoutes);
app.use('/api/photos', requireAuth, photosRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error' });
});

app.listen(PORT, () => {
  console.log(`C&J server listening on http://localhost:${PORT}`);
});
