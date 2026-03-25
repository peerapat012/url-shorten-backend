import { prisma } from '../config/prisma.js'

export const getUserUrls = async (userId: string) => {
    return await prisma.shortUrl.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};