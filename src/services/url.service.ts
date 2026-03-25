import { nanoid } from 'nanoid';
import { prisma } from '../config/prisma.js';
import { redisClient } from '../config/redis.js';

export const createShortUrl = async (originalUrl: string, userId: string) => {
    const shortCode = nanoid(6);

    const newUrl = await prisma.shortUrl.create({
        data: {
            originalUrl,
            shortCode,
            userId
        }
    })

    await redisClient.setEx(`url:${shortCode}`, 3600, originalUrl);

    return newUrl;
}

export const getOriginalUrl = async (shortCode: string) => {
    const cachedUrl = await redisClient.get(`url:${shortCode}`);
    if (cachedUrl) return cachedUrl;

    const urlData = await prisma.shortUrl.findUnique({
        where: { shortCode }
    });

    if (urlData) {
        await redisClient.setEx(`url:${shortCode}`, 3600, urlData.originalUrl);

        prisma.shortUrl.update({
            where: { id: urlData.id },
            data: { clicks: { increment: 1 } }
        }).catch(err => console.log('Click update failed', err))

        return urlData.originalUrl;
    }

    return null;
}