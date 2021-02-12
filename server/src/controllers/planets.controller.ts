import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri } from '../util/misc';
import PlanetsService from '../services/planets.service';
import SpeciesService from '../services/species.service';
import StarshipsService from '../services/starship.service';
import VehiclesService from '../services/vehicles.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';

class PlanetsController {
  private static instance: PlanetsController;

  static getInstance() {
    if (!PlanetsController.instance) {
      PlanetsController.instance = new PlanetsController();
    }
    return PlanetsController.instance;
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
      const peopleService = new PeopleService();
      // Get Hero Details
      const hero = await peopleService.getDetailsById(user.swapiHeroId);

      const heroPlanetId = getIdFromResourceUri(hero.homeworld);
      const planetsService = new PlanetsService();
      const planets = [
        {
          id: heroPlanetId,
          name: await planetsService.getRecordNameById(heroPlanetId)
        }
      ];

      return res.status(200).send(planets);
    } catch (err) {
      return res.send(err);
    }
  }

  findOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { user } = req;
      if (!user) {
        logger.debug('Unauthorized');
        return res.status(401).send('Unauthorized');
      }

      // Get Hero Details
      const peopleService = new PeopleService();
      const hero = await peopleService.getDetailsById(user.swapiHeroId);

      const resourceId = req.params.id;

      // Check if user has access to resource
      if (getIdFromResourceUri(hero.homeworld) !== resourceId) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /starships/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const planetsService = new PlanetsService();
      const planet = await planetsService.getDetailsById(resourceId);

      await Promise.all(
        planet.residents.map(async (resident: string, index: number) => {
          const residentId = getIdFromResourceUri(resident);

          const hasAccess = user.swapiHeroId.includes(residentId);
          planet.residents[index] = {
            id: residentId,
            name: await peopleService.getRecordNameById(residentId),
            hasAccess
          };
        })
      );

      const filmsService = new FilmsService();
      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        planet.films.map(async (film: string, index: number) => {
          const filmId = getIdFromResourceUri(film);
          const hasAccess = heroFilmIds.includes(filmId);
          planet.films[index] = {
            id: filmId,
            name: await filmsService.getRecordNameById(filmId),
            hasAccess
          };
        })
      );

      return res.status(200).send(planet);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  };
}

export default PlanetsController.getInstance();
