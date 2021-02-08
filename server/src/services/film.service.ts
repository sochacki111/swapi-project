import axios from '../util/axios-swapi';
import { IFilm } from '../intefaces/IFilm';
import logger from '../util/logger';
import { getAsync, setAsync } from '../config/redis';
import { REDIS_CACHE_EXPIRE_TIME } from '../util/secrets';

const getFilmDetailsByFilmId = async (filmId: string): Promise<IFilm> => {
  try {
    const cache = await getAsync(`film:${filmId}`);
    if (cache) {
      logger.debug('Using cached film');
      return JSON.parse(cache);
    }

    // TODO Refactor descructurization
    const { data } = await axios.get(`/films/${filmId}`);

    const film: IFilm = data;
    logger.debug('getFilmDetailsByFilmId success');
    await setAsync(
      `film:${filmId}`,
      REDIS_CACHE_EXPIRE_TIME,
      JSON.stringify(film)
    );
    logger.debug('film cached');

    return film;
  } catch (err) {
    logger.error(err);
    return err;
  }
};

export default getFilmDetailsByFilmId;
