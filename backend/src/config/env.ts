import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 5000),
    mongoUri: process.env.MONGO_URI ?? '',
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET ?? '',
    redisUrl: process.env.REDIS_URL,
};
