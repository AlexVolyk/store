import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { afterAll } from 'vitest';
import { redis } from '../src/config/redis.ts';

dotenv.config({
    path: '.env.test',
});

afterAll(async () => {
    await mongoose.connection.close();
    if (redis.isOpen) {
        await redis.quit();
    }
});

