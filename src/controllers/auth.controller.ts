import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { generateTokens } from '../utils/token.util.js';
import { RegisterRequest, AuthResponse, LoginRequest } from '../types/auth.type.js';

export const register = async (req: RegisterRequest, res: Response<AuthResponse | { message: string }>): Promise<void> => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const { accessToken, refreshToken } = generateTokens(user.id);

        const hashedRT = await bcrypt.hash(refreshToken, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRT },
        });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: LoginRequest, res: Response<AuthResponse | { message: string }>): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        const hashedRT = await bcrypt.hash(refreshToken, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: hashedRT },
        });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};