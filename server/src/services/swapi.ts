import axios from 'axios';
import { IHero } from '../intefaces/IHero';
import { getIdFromResourceUri } from '../util/misc';
import logger from '../util/logger';

export const getAllHeroIds = async (
  endpoint: string = 'https://swapi.dev/api/people',
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

    logger.debug('getAllHeroIds success!')
    return totalResults;
  } catch (err) {
    console.log(err);
    return err;
  }
};
