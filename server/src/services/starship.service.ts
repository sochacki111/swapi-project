import axios from '../util/axios-swapi';
import { IStarship } from '../intefaces/IStarship';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';

export const getStarshipDetailsByStarshipId = async (
  starshipId: string
): Promise<IStarship> => {
  try {
    const cache = await getAsync(`starship:${starshipId}`);
    if (cache) {
      logger.debug('Using cached starship');
      return JSON.parse(cache);
    }

    // TODO Refactor descructurization
    const { data } = await axios.get(`/starships/${starshipId}`);

    const starship: IStarship = data;
    logger.debug('getStarshipDetailsByStarshipId success');
    await setAsync(
      `starship:${starshipId}`,
      REDIS_CACHE_EXPIRE_TIME,
      JSON.stringify(starship)
    );
    logger.debug('starship cached');

    return starship;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

export const getStarshipNameByStarshipId = async (
  starshipId: string
): Promise<string> => {
  const { name } = await getStarshipDetailsByStarshipId(starshipId);
  return name;
};
