import fs from 'fs';
import dotenv from 'dotenv';
import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug(
    'Using .env.example file to supply config environment variables'
  );
  dotenv.config({ path: '.env.example' });
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const MONGODB_URI = prod
  ? String(process.env.MONGODB_URI)
  : String(process.env.MONGODB_URI_LOCAL);

if (!MONGODB_URI) {
  if (prod) {
    logger.error(
      'No mongo connection string. Set MONGODB_URI environment variable.'
    );
  } else {
    logger.error(
      'No mongo connection string. Set MONGODB_URI_LOCAL environment variable.'
    );
  }
  process.exit(1);
}

export const JWT_SECRET = process.env.JWT_SECRET || 'somesecrettoken';
// Is this conver correct?
export const TOKEN_TIMEOUT = Number(process.env.TOKEN_TIMEOUT);
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const REDIS_CACHE_EXPIRE_TIME =
  Number(process.env.REDIS_SECONDS) || 3600;
