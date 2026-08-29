import { createClient } from 'redis';
import { env } from './env.ts';

export const redis = createClient({
    url: env.redisUrl || 'redis://localhost:6379',
});

redis.on('error', (err) => {
    // Only log if redis was previously connected or url explicitly set
    if (env.redisUrl) {
        console.warn('[Redis Error]:', err.message);
    }
});

try {
    await redis.connect();
    console.log('⚡ [Redis] Connected successfully');
} catch {
    console.log('ℹ️ [Redis] Server not running locally — caching bypassed, using MongoDB');
}
