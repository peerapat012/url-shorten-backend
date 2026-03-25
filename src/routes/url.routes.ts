import { Router } from 'express';
import { shorten, redirect, getMyUrls } from '../controllers/url.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected: Only logged-in users can create links
router.post('/shorten', authenticate, shorten);

// Public: Anyone can be redirected
router.get('/:shortCode', redirect);

// Protected: Only logged-in users can get their URLs use for dashboard
router.get('/my-urls', authenticate, getMyUrls);

export default router;