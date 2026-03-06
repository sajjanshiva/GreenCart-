import rateLimit from 'express-rate-limit';

// For login & register — strict limit
// Max 10 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// For placing orders — prevent spam orders
// Max 20 orders per 15 minutes per IP
export const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many orders placed. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// For general API — global protection
// Max 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests. Please slow down."
    },
    standardHeaders: true,
    legacyHeaders: false,
});