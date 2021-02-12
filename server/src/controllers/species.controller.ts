import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri } from '../util/misc';
import PlanetsService from '../services/planets.service';
import SpeciesService from '../services/species.service';
import StarshipsService from '../services/starship.service';
import VehiclesService from '../services/vehicles.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';

class SpeciesController {
  private static instance: SpeciesController;

  static getInstance() {
    if (!SpeciesController.instance) {
      SpeciesController.instance = new SpeciesController();
    }
    return SpeciesController.instance;
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
      const peopleService = new PeopleService();
      const hero = await peopleService.getDetailsById(user.swapiHeroId);

      // Get Hero film Ids
      const heroSpeciesIds = hero.species.map((species: string) =>
        getIdFromResourceUri(species)
      );

      const speciesService = new SpeciesService();
      const species = await Promise.all(
        heroSpeciesIds.map(async (speciesId: string) => ({
          id: speciesId,
          name: await speciesService.getRecordNameById(speciesId)
        }))
      );
      return res.status(200).send(species);
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
      if (
        !hero.species
          .map((species: string) => getIdFromResourceUri(species))
          .includes(resourceId)
      ) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /species/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const speciesService = new SpeciesService();
      const species = await speciesService.getDetailsById(resourceId);

      const planetsService = new PlanetsService();
      const heroHomeworldId = getIdFromResourceUri(hero.homeworld);
      const speciesHomeworldId = getIdFromResourceUri(species.homeworld);
      species.homeworld = {
        id: speciesHomeworldId,
        name: await planetsService.getRecordNameById(speciesHomeworldId),
        hasAccess: heroHomeworldId === speciesHomeworldId
      };

      await Promise.all(
        species.people.map(async (person: string, index: number) => {
          const personId = getIdFromResourceUri(person);

          const hasAccess = user.swapiHeroId.includes(personId);
          species.people[index] = {
            id: personId,
            name: await peopleService.getRecordNameById(personId),
            hasAccess
          };
        })
      );

      const filmsService = new FilmsService();
      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        species.films.map(async (film: string, index: number) => {
          const filmId = getIdFromResourceUri(film);
          const hasAccess = heroFilmIds.includes(filmId);
          species.films[index] = {
            id: filmId,
            name: await filmsService.getRecordNameById(filmId),
            hasAccess
          };
        })
      );

      return res.status(200).send(species);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  };
}

export default SpeciesController.getInstance();
