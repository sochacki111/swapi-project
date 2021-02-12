import axios from '../util/axios-swapi';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';

export default class ResourceService {
  private resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
  }

  // TODO How to get Resource Type here? via constructor or cleaner way?
  public async getDetailsById(resourceId: string) {
    try {
      const cache = await getAsync(`${this.resourceName}:${resourceId}`);
      if (cache) {
        logger.debug(`Using cached ${this.resourceName}`);
        return JSON.parse(cache);
      }

      const { data: resource } = await axios.get(`/${this.resourceName}/${resourceId}`);

      logger.debug(`${this.resourceName} getDetailsById success`);
      await setAsync(
        `${this.resourceName}:${resourceId}`,
        REDIS_CACHE_EXPIRE_TIME,
        JSON.stringify(resource)
      );
      logger.debug(`${this.resourceName} record cached`);

      return resource;
    } catch (err) {
      logger.error(err);
      return err;
    }
  }
  
  public async getRecordNameById(resourceId: string): Promise<string> {
    const { name: recordName } = await this.getDetailsById(resourceId);
    return recordName;
  }
}
