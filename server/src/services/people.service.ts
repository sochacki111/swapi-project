import axios from '../util/axios-swapi';
import { IPlanet } from '../intefaces/IPlanet';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';
import ResourceService from './resource.service';
import { getIdFromResourceUri } from '../util/misc';
import { IPeople } from '../intefaces/IPeople';

export default class PeopleService extends ResourceService {
  constructor() {
    super('people');
  }

  // TODO should it be exported/private?
  // TODO Rename totalResult with totalHeroIds?
  private async getPeopleIdsRecursively(
    endpoint = '/people',
    totalResults: string[] = []
  ): Promise<string[]> {
    const { data } = await axios.get(endpoint);

    data.results.forEach((person: IPeople) => {
      totalResults.push(getIdFromResourceUri(person.url));
    });

    if (data.next) {
      await this.getPeopleIdsRecursively(data.next, totalResults);
    }

    return totalResults;
  }

  public async getAllPeopleIds(): Promise<string[]> {
    // TODO Rename recursive function getHeroIds?
    // TODO Apply anoter try catch here?
    try {
      const cache = await getAsync('allHeroIds');
      if (cache) {
        logger.debug('Using cached hero ids');
        logger.debug('getAllHeroIds success');
        return JSON.parse(cache);
      }

      const allHeroIds = await this.getPeopleIdsRecursively();
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
}
