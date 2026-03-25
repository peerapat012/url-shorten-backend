import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import { connectRedis } from './config/redis.js';
import authRoute from './routes/auth.routes.js'
import urlRoute from './routes/url.routes.js'

export const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

// Routes
app.use('/api/auth', authRoute);
app.use('/', urlRoute);

const startServer = async () => {
    try {
        await connectRedis();

        if (process.env.NODE_ENV !== 'test') {
            const PORT = process.env.PORT || 3000;
            app.listen(PORT, () => console.log(`Server running on ${PORT}`));
        }
    } catch (error) {
        console.error('[server]: Failed to start', error);
        process.exit(1);
    }
};


startServer();
