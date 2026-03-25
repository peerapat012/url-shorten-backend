import { Response } from "express";
import { AuthRequest } from '../middlewares/auth.middleware.js'
import { createShortUrl, getOriginalUrl } from '../services/url.service.js'
import { getUserUrls } from "../services/user.service.js";

export const shorten = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            res.status(400).json({ message: 'URL is required' });
            return;
        }

        const url = await createShortUrl(originalUrl, req.userId!);
        res.status(201).json(url);
    } catch (error) {
        res.status(500).json({ message: 'Error shortening URL' })
    }
}

export const redirect = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { shortCode } = req.params;
        const originalUrl = await getOriginalUrl(shortCode as string);

        if (originalUrl) {
            res.redirect(originalUrl);
            return;
        }

        res.status(404).json({ message: 'URL not found' });
    } catch (error) {
        res.status(500).json({ message: 'Redirect error' });
    }
};

export const getMyUrls = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const urls = await getUserUrls(userId!);
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your URLs' });
    }
};