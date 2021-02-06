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
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI_LOCAL;

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
export const TOKEN_TIMEOUT: number = Number(process.env.TOKEN_TIMEOUT);
export const REDIS_PORT = process.env.REDIS_PORT || 6379;