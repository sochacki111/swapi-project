import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { IPeople } from '../intefaces/IPeople';
import { getIdFromResourceUri, deleteIrrelevantProperties } from '../util/misc';
import PlanetsService from '../services/planets.service';
import SpeciesService from '../services/species.service';
import StarshipsService from '../services/starship.service';
import VehiclesService from '../services/vehicles.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';
import { IFilm } from '../intefaces/IFilm';
import IResourceDetails from '../intefaces/IResourceDetails';

// TODO Implement strategy design pattern to get rid off redundant code in controllers
class FilmsController {
  private static instance: FilmsController;

  private static peopleService: PeopleService;

  private static filmsService: FilmsService;
  
  private static vehiclesService: VehiclesService;

  private static starshipsService: StarshipsService;

  private constructor() {}

  static getInstance() {
    if (!FilmsController.instance) {
      FilmsController.instance = new FilmsController();
      FilmsController.peopleService = new PeopleService();
      FilmsController.filmsService = new FilmsService();
      FilmsController.vehiclesService = new VehiclesService();
      FilmsController.starshipsService = new StarshipsService();
    }
    return FilmsController.instance;
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
      const hero: IPeople = await FilmsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      // Get Hero film Ids
      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );

      const films = await Promise.all(
        heroFilmIds.map(async (filmId: string) => ({
          id: filmId,
          title: await FilmsController.filmsService.getRecordNameById(filmId)
        }))
      );
      return res.status(200).send(films);
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
      const hero: IPeople = await FilmsController.peopleService.getDetailsById(
        user.swapiHeroId
      );

      const resourceId = req.params.id;
      // TODO NICE TO HAVE Check if film with this id exists like films/7 404 or no ?

      // Check if user has access to resource
      if (
        !hero.films
          .map((film: string) => getIdFromResourceUri(film))
          .includes(resourceId)
      ) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /films/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const film: IFilm = await FilmsController.filmsService.getDetailsById(
        resourceId
      );

      await Promise.all(
        film.characters.map(
          async (character: string | IResourceDetails, index: number) => {
            const characterId = getIdFromResourceUri(character as string);

            const hasAccess = user.swapiHeroId.includes(characterId);
            film.characters[index] = {
              id: characterId,
              name: await FilmsController.peopleService.getRecordNameById(
                characterId
              ),
              hasAccess
            };
          }
        )
      );

      const planetService = new PlanetsService();
      const heroPlanetId = getIdFromResourceUri(hero.homeworld);
      await Promise.all(
        film.planets.map(
          async (planet: string | IResourceDetails, index: number) => {
            const planetId = getIdFromResourceUri(planet as string);

            const hasAccess = heroPlanetId.includes(planetId);
            film.planets[index] = {
              id: planetId,
              name: await planetService.getRecordNameById(planetId),
              hasAccess
            };
          }
        )
      );

      const heroStarshipIds = hero.starships.map((starship: string) =>
        getIdFromResourceUri(starship)
      );
      await Promise.all(
        film.starships.map(
          async (starship: string | IResourceDetails, index: number) => {
            const starshipId = getIdFromResourceUri(starship as string);
            const hasAccess = heroStarshipIds.includes(starshipId);
            film.starships[index] = {
              id: starshipId,
              name: await FilmsController.starshipsService.getRecordNameById(starshipId),
              hasAccess
            };
          }
        )
      );

      const heroVehicleIds = hero.vehicles.map((vehicle: string) =>
        getIdFromResourceUri(vehicle)
      );
      await Promise.all(
        film.vehicles.map(
          async (vehicle: string | IResourceDetails, index: number) => {
            const vehicleId = getIdFromResourceUri(vehicle as string);

            const hasAccess = heroVehicleIds.includes(vehicleId);
            film.vehicles[index] = {
              id: vehicleId,
              name: await FilmsController.vehiclesService.getRecordNameById(vehicleId),
              hasAccess
            };
          }
        )
      );

      const speciesService = new SpeciesService();
      const heroSpeciesIds = hero.species.map((species: string) =>
        getIdFromResourceUri(species)
      );
      await Promise.all(
        film.species.map(
          async (species: string | IResourceDetails, index: number) => {
            const speciesId = getIdFromResourceUri(species as string);

            const hasAccess = heroSpeciesIds.includes(speciesId);
            film.species[index] = {
              id: speciesId,
              name: await speciesService.getRecordNameById(speciesId),
              hasAccess
            };
          }
        )
      );

      deleteIrrelevantProperties(film);

      return res.status(200).send(film);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  }
}

export default FilmsController.getInstance();
