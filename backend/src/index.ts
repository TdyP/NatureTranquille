import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {Pool} from 'pg';

dotenv.config();

const app = express();
const port = process.env.API_PORT || 4000;

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({status: 'ok', database: 'connected'});
    } catch (error) {
        res.status(503).json({status: 'error', database: 'disconnected'});
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'NatureTranquille API',
        version: '0.1.0',
        endpoints: {
            health: '/health',
            tiles: '/tiles/{z}/{x}/{y}.mvt (coming soon)',
        },
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Backend API running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await pool.end();
    process.exit(0);
});
