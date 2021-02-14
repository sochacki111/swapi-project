import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri, deleteIrrelevantProperties } from '../util/misc';
import PlanetsService from '../services/planets.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';
import { IPeople } from '../intefaces/IPeople';
import { IPlanet } from '../intefaces/IPlanet';
import IResourceDetails from '../intefaces/IResourceDetails';

class PlanetsController {
  private static instance: PlanetsController;

  private static planetsService: PlanetsService;

  private static peopleService: PeopleService;

  private static filmsService: FilmsService;

  private constructor() {}

  static getInstance() {
    if (!PlanetsController.instance) {
      PlanetsController.instance = new PlanetsController();
      PlanetsController.planetsService = new PlanetsService();
      PlanetsController.peopleService = new PeopleService();
      PlanetsController.filmsService = new FilmsService();
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
      // Get Hero Details
      const hero: IPeople = await PlanetsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      const heroPlanetId = getIdFromResourceUri(hero.homeworld);
      const planets = [
        {
          id: heroPlanetId,
          name: await PlanetsController.planetsService.getRecordNameById(
            heroPlanetId
          )
        }
      ];

      return res.status(200).send(planets);
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
      const hero = await PlanetsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      const resourceId = req.params.id;

      // Check if user has access to resource
      if (getIdFromResourceUri(hero.homeworld) !== resourceId) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /starships/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const planet: IPlanet = await PlanetsController.planetsService.getDetailsById(
        resourceId
      );

      await Promise.all(
        planet.residents.map(
          async (resident: string | IResourceDetails, index: number) => {
            const residentId = getIdFromResourceUri(resident as string);

            const hasAccess = user.swapiHeroId.includes(residentId);
            planet.residents[index] = {
              id: residentId,
              name: await PlanetsController.peopleService.getRecordNameById(
                residentId
              ),
              hasAccess
            };
          }
        )
      );

      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        planet.films.map(
          async (film: string | IResourceDetails, index: number) => {
            const filmId = getIdFromResourceUri(film as string);
            const hasAccess = heroFilmIds.includes(filmId);
            planet.films[index] = {
              id: filmId,
              name: await PlanetsController.filmsService.getRecordNameById(
                filmId
              ),
              hasAccess
            };
          }
        )
      );

      deleteIrrelevantProperties(planet);

      return res.status(200).send(planet);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  }
}

export default PlanetsController.getInstance();
