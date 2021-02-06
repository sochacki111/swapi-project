import redis from 'redis';
import { promisify } from 'util';
import { REDIS_PORT } from '../util/secrets';

const client = redis.createClient(REDIS_PORT);

export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.setex).bind(client);

