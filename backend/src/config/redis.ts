import { createClient } from 'redis';
import { env } from './env.ts';

export const redis = createClient({
    url: env.redisUrl || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: false,
        connectTimeout: 200,
    },
});

redis.on('error', () => {
    // Silent error handler to avoid unhandled socket errors when offline
});

try {
    await redis.connect();
    console.log('⚡ [Redis] Connected successfully');
} catch {
    console.log('ℹ️ [Redis] Server not running locally — caching bypassed, using MongoDB');
}
