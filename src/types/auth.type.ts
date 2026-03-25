import { Request } from 'express';

export interface RegisterDTO {
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterRequest extends Request {
    body: RegisterDTO;
}

export interface LoginRequest extends Request {
    body: LoginDTO;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface JWTPayload {
    userId: string;
    iat?: number;
    exp?: number;
}