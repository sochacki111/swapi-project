import axios from '../util/axios-swapi';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';

// TODO Strategy pattern?
export default class ResourceService {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  // TODO How to get Resource Type here? via constructor or cleaner way?
  public async getDetailsById(resourceId: string) {
    try {
      const cache = await getAsync(`${this.name}:${resourceId}`);
      if (cache) {
        logger.debug(`Using cached ${this.name}`);
        return JSON.parse(cache);
      }

      // TODO Refactor descructurization
      const { data } = await axios.get(`/${this.name}/${resourceId}`);

      const resource = data;
      logger.debug(`${this.name} getDetailsById success`);
      await setAsync(
        `${this.name}:${resourceId}`,
        REDIS_CACHE_EXPIRE_TIME,
        JSON.stringify(resource)
      );
      logger.debug(`${this.name} record cached`);

      return resource;
    } catch (err) {
      logger.error(err);
      return err;
    }
  }
  
  public async getNameById(resourceId: string): Promise<string> {
    const { name } = await this.getDetailsById(resourceId);
    return name;
  }
}
