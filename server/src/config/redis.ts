import redis from 'redis';
import { promisify } from 'util';
import { REDIS_URL } from '../util/secrets';
import logger from '../util/logger';

// TODO Check if connected successfuly
const client = process.env.NODE_ENV === 'test' ? require('fakeredis').createClient() : redis.createClient({ url: REDIS_URL });
logger.debug('redis connected');

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.setex).bind(client);