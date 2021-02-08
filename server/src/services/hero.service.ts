import axios from '../util/axios-swapi';
import { IHero } from '../intefaces/IHero';
import { getIdFromResourceUri } from '../util/misc';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';

// TODO Abstract this service. Get resource by id ?
// TODO Create multiple services for each resource
// TODO Axios interceptors?
// TODO Should it return undefined ? How to avoid that ?
export const getHeroDetailsByHeroId = async (
  heroId: string
): Promise<IHero> => {
  try {
    const cache = await getAsync('hero');
    if (cache) {
      logger.debug('Using cached hero');
      return JSON.parse(cache);
    }

    // TODO Refactor descructurization
    const { data } = await axios.get(`/people/${heroId}`);
    const hero: IHero = data;
    logger.debug('getHeroDetailsByHeroId success');
    await setAsync('hero', REDIS_CACHE_EXPIRE_TIME, JSON.stringify(hero));
    logger.debug('hero cached');

    return hero;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

// TODO should it be exported/private?
// TODO Rename totalResult with totalHeroIds?
export const getHeroIdsRecursively = async (
  endpoint = '/people',
  totalResults: string[] = []
): Promise<string[]> => {
  const { data } = await axios.get(endpoint);

  data.results.forEach((hero: IHero) => {
    totalResults.push(getIdFromResourceUri(hero.url));
  });

  if (data.next) {
    await getHeroIdsRecursively(data.next, totalResults);
  }

  return totalResults;
};

export const getAllHeroIds = async (): Promise<string[]> => {
  // TODO Rename recursive function getHeroIds?
  // TODO Apply anoter try catch here?
  try {
    const cache = await getAsync('allHeroIds');
    if (cache) {
      logger.debug('Using cached hero ids');
      logger.debug('getAllHeroIds success');
      return JSON.parse(cache);
    }

    const allHeroIds = await getHeroIdsRecursively();
    logger.debug('getAllHeroIds success');
    await setAsync(
      'allHeroIds',
      REDIS_CACHE_EXPIRE_TIME,
      JSON.stringify(allHeroIds)
    );
    logger.debug('Hero Ids cached');
    return allHeroIds;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

export const getHeroFilmIdsByHeroId = async (
  heroId: string
): Promise<string[]> => {
  const hero = await getHeroDetailsByHeroId(heroId);
  return hero.films.map((film) => getIdFromResourceUri(film));
};
