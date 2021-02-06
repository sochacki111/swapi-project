import axios from '../util/axios-swapi';
import { AxiosResponse } from 'axios';
import { IHero } from '../intefaces/IHero';
import { getIdFromResourceUri } from '../util/misc';
import logger from '../util/logger';

// TODO Axios interceptors?
// TODO Get resource by id ?
// Should it return undefined ? How to avoid that ?
export const getHeroById = async (id: string): Promise<IHero> => {
  try {
    // TODO Refactor
    const { data } = await axios.get(`/people/${id}`);
    const hero: IHero = data;
    logger.debug('getHeroById success');

    return hero;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

export const getAllHeroIds = async (
  endpoint: string = '/people',
  totalResults: string[] = []
) => {
  try {
    const { data } = await axios.get(endpoint);
    data.results.forEach((hero: IHero) => {
      totalResults.push(getIdFromResourceUri(hero.url));
    });

    if (data.next) {
      await getAllHeroIds(data.next, totalResults);
    }

    logger.debug('getAllHeroIds success');
    return totalResults;
  } catch (err) {
    logger.error(err);
    return err;
  }
};
