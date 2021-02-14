import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri, deleteIrrelevantProperties } from '../util/misc';
import StarshipsService from '../services/starship.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';

class StarshipsController {
  private static instance: StarshipsController;

  private static peopleService: PeopleService;

  private static filmsService: FilmsService;

  private static starshipsService: StarshipsService;

  private constructor() {}

  static getInstance() {
    if (!StarshipsController.instance) {
      StarshipsController.instance = new StarshipsController();
      StarshipsController.peopleService = new PeopleService();
      StarshipsController.filmsService = new FilmsService();
      StarshipsController.starshipsService = new StarshipsService();
    }
    return StarshipsController.instance;
  }

  // eslint-disable-next-line class-methods-use-this
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { user } = req;
      if (!user) {
        logger.debug('Unauthorized');
        return res.status(401).send('Unauthorized');
      }
      // Get Hero Details
      const hero = await StarshipsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      const heroStarshipIds = hero.starships.map((starship: string) =>
        getIdFromResourceUri(starship)
      );

      const starships = await Promise.all(
        heroStarshipIds.map(async (starshipId: string) => ({
          id: starshipId,
          name: await StarshipsController.starshipsService.getRecordNameById(
            starshipId
          )
        }))
      );
      return res.status(200).send(starships);
    } catch (err) {
      return res.send(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async findOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const { user } = req;
      if (!user) {
        logger.debug('Unauthorized');
        return res.status(401).send('Unauthorized');
      }

      // Get Hero Details
      const hero = await StarshipsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      const resourceId = req.params.id;

      // Check if user has access to resource
      if (
        !hero.starships
          .map((starship: string) => getIdFromResourceUri(starship))
          .includes(resourceId)
      ) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /starships/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const starship = await StarshipsController.starshipsService.getDetailsById(
        resourceId
      );

      await Promise.all(
        starship.pilots.map(async (pilot: string, index: number) => {
          const pilotId = getIdFromResourceUri(pilot);

          const hasAccess = user.swapiHeroId.includes(pilotId);
          starship.pilots[index] = {
            id: pilotId,
            name: await StarshipsController.peopleService.getRecordNameById(
              pilotId
            ),
            hasAccess
          };
        })
      );

      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        starship.films.map(async (film: string, index: number) => {
          const filmId = getIdFromResourceUri(film);
          const hasAccess = heroFilmIds.includes(filmId);
          starship.films[index] = {
            id: filmId,
            name: await StarshipsController.filmsService.getRecordNameById(
              filmId
            ),
            hasAccess
          };
        })
      );

      deleteIrrelevantProperties(starship);

      return res.status(200).send(starship);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  }
}

export default StarshipsController.getInstance();
