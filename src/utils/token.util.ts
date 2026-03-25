import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign({ userId }, ACCESS_SECRET, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
};