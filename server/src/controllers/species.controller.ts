import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri, deleteIrrelevantProperties } from '../util/misc';
import PlanetsService from '../services/planets.service';
import SpeciesService from '../services/species.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';
import { IPeople } from '../intefaces/IPeople';
import { ISpecies } from '../intefaces/ISpecies';
import IResourceDetails from '../intefaces/IResourceDetails';

class SpeciesController {
  private static instance: SpeciesController;

  private static planetsService: PlanetsService;

  private static speciesService: SpeciesService;

  private static peopleService: PeopleService;

  private static filmsService: FilmsService;

  private constructor() {}

  static getInstance() {
    if (!SpeciesController.instance) {
      SpeciesController.instance = new SpeciesController();
      SpeciesController.planetsService = new PlanetsService();
      SpeciesController.speciesService = new SpeciesService();
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
      const hero: IPeople = await SpeciesController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      // Get Hero film Ids
      const heroSpeciesIds = hero.species.map((species: string) =>
        getIdFromResourceUri(species)
      );

      const species = await Promise.all(
        heroSpeciesIds.map(async (speciesId: string) => ({
          id: speciesId,
          name: await SpeciesController.speciesService.getRecordNameById(
            speciesId
          )
        }))
      );
      return res.status(200).send(species);
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
      const hero = await SpeciesController.peopleService.getDetailsById(user.swapiHeroId);

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

      const species: ISpecies = await SpeciesController.speciesService.getDetailsById(
        resourceId
      );

      const heroHomeworldId = getIdFromResourceUri(hero.homeworld);
      const speciesHomeworldId = getIdFromResourceUri(
        species.homeworld as string
      );
      species.homeworld = {
        id: speciesHomeworldId,
        name: await SpeciesController.planetsService.getRecordNameById(
          speciesHomeworldId
        ),
        hasAccess: heroHomeworldId === speciesHomeworldId
      };

      await Promise.all(
        species.people.map(
          async (person: string | IResourceDetails, index: number) => {
            const personId = getIdFromResourceUri(person as string);

            const hasAccess = user.swapiHeroId.includes(personId);
            species.people[index] = {
              id: personId,
              name: await SpeciesController.peopleService.getRecordNameById(personId),
              hasAccess
            };
          }
        )
      );

      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        species.films.map(
          async (film: string | IResourceDetails, index: number) => {
            const filmId = getIdFromResourceUri(film as string);
            const hasAccess = heroFilmIds.includes(filmId);
            species.films[index] = {
              id: filmId,
              name: await SpeciesController.filmsService.getRecordNameById(
                filmId
              ),
              hasAccess
            };
          }
        )
      );

      deleteIrrelevantProperties(species);

      return res.status(200).send(species);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  }
}

export default SpeciesController.getInstance();
