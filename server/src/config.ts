import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
