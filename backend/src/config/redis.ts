import { createClient } from 'redis';
import { env } from './env.ts';

export const redis = createClient({
    url: env.redisUrl || 'redis://localhost:6379',
});

redis.on('error', (err) => console.log('[Redis Error]', err));

if (env.redisUrl) {
    await redis.connect();
}
