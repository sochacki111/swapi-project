import axios from '../util/axios-swapi';
import { IPlanet } from '../intefaces/IPlanet';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';
import ResourceService from './resource.service';
import { getIdFromResourceUri } from '../util/misc';
import { IHero } from '../intefaces/IHero';

export default class PeopleService extends ResourceService {
  constructor() {
    super('people');
  }

  // TODO should it be exported/private?
  // TODO Rename totalResult with totalHeroIds?
  private async getHeroIdsRecursively(
    endpoint = '/people',
    totalResults: string[] = []
  ): Promise<string[]> {
    const { data } = await axios.get(endpoint);

    data.results.forEach((hero: IHero) => {
      totalResults.push(getIdFromResourceUri(hero.url));
    });

    if (data.next) {
      await this.getHeroIdsRecursively(data.next, totalResults);
    }

    return totalResults;
  }

  public async getAllHeroIds(): Promise<string[]> {
    // TODO Rename recursive function getHeroIds?
    // TODO Apply anoter try catch here?
    try {
      const cache = await getAsync('allHeroIds');
      if (cache) {
        logger.debug('Using cached hero ids');
        logger.debug('getAllHeroIds success');
        return JSON.parse(cache);
      }

      const allHeroIds = await this.getHeroIdsRecursively();
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
  }

  public async getHeroFilmIdsByHeroId(heroId: string): Promise<string[]> {
    const hero = await this.getDetailsById(heroId);

    return hero.films.map((film: string) => getIdFromResourceUri(film));
  }
}
