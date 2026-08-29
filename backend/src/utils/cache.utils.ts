import { redis } from '../config/redis.ts';


export const clearCachePattern = async (pattern: string): Promise<void> => {
    if (!redis.isOpen) {
        return;
    }

    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (error) {
        console.warn('[Cache Clear Error]:', error);
    }
};
