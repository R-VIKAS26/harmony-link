
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './spotify-auth.js';
import recommendRoutes from './recommend.js';
import analyticsRoutes from './analytics.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
}));

app.use('/auth', authRoutes);
app.use('/recommend', recommendRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('Harmony Link Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
