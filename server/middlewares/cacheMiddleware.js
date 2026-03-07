import redis from '../Configs/redis.js';

const CACHE_EXPIRY = 60 * 10; // 10 minutes

export const cacheMiddleware = (key) => async (req, res, next) => {
    try {
        const cachedData = await redis.get(key);

        if (cachedData) {
            console.log(`Cache HIT for: ${key} ✅`);
            return res.json({
                success: true,
                products: cachedData,
                fromCache: true
            });
        }

        console.log(`Cache MISS for: ${key} ❌`);
        res.sendResponse = res.json.bind(res);
        res.json = async (data) => {
            if (data.success && data.products) {
                await redis.setex(key, CACHE_EXPIRY, JSON.stringify(data.products));
                console.log(`Cached: ${key} for ${CACHE_EXPIRY} seconds`);
            }
            res.sendResponse(data);
        };

        next();
    } catch (error) {
        console.log('Cache error:', error.message);
        next(); // if redis fails, continue without cache
    }
};

export const clearCache = async (key) => {
    try {
        await redis.del(key);
        console.log(`Cache cleared: ${key}`);
    } catch (error) {
        console.log('Cache clear error:', error.message);
    }
};