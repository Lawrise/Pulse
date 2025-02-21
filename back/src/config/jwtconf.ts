import { Secret } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export const JWT_SECRET: Secret = process.env.JWT_SECRET;