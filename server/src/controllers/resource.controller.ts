import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';

import logger from '../util/logger';
import User from '../models/user';
import { IHero } from '../intefaces/IHero';
// import { getStarshipNameByStarshipId } from '../services/starship.service';
// import { getVehicleNameByVehicleId } from '../services/vehicle.service';
// import { getPersonNameByPersonId } from '../services/people.service';
import getFilmDetailsByFilmId from '../services/films.service';
import { getIdFromResourceUri } from '../util/misc';
import PlanetsService from '../services/planets.service';
import FilmsService from '../services/films.service';

// declare global {
//   namespace Express {
//     interface User {
//       _id: string;
//       email: string;
//       swapiHeroId: string;
//     }
//   }
// }

export default class ResourceController {
  private resourceName: string;

  // static resourceName: string;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
  }


  /*

  // TODO Refactor const { user } = req;
  // eslint-disable-next-line class-methods-use-this
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    // TODO Return just a list from which user can navigate to film details?
    // TODO Query for user hero id or pass it with token to frontend and back?
    try {
      const { user } = req;
      if (!user) {
        logger.debug('Unauthorized');
        return res.status(401).send('Unauthorized');
      }

      // Get Hero film Ids
      const heroFilmIds = await getHeroFilmIdsByHeroId(user._id);

      const filmService = new Film();
      // TODO fix eslint
      const films = await Promise.all(
        heroFilmIds.map(async (filmId) => await filmService.getRecordNameById(filmId))
      );
      return res.status(200).send(films);
    } catch (err) {
      return res.send(err);
    }
  }

  protected async validateResource(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      if (!user) {
        logger.debug('Unauthorized');
        return res.status(401).send('Unauthorized');
      }

      // Get Hero Details
      const hero: IHero = await getHeroDetailsByHeroId(user.swapiHeroId);

      const resourceId = req.params.id;
      // TODO NICE TO HAVE Check if resource with this id exists like resources/7 404 or no ?

      // Check if resourceId exists in hero resource ids
      if (
        !hero[this.resourceName]
          .map((resource) => getIdFromResourceUri(resource))
          .includes(resourceId)
      ) {
        logger.debug(
          `From Parent Forbidden access for user ${user.email} to resource /${this.resourceName}/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }
    } catch (e) {
      console.log(e);
    }
  }
  // TODO Make this function as one for every resource? Can it be abstracted ?
  // public async findOne(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response> {
  //   try {
  //     const { user } = req;
  //     if (!user) {
  //       logger.debug('Unauthorized');
  //       return res.status(401).send('Unauthorized');
  //     }

  //     // Get Hero Details
  //     const hero: IHero = await getHeroDetailsByHeroId(user.swapiHeroId);

  //     const resourceId = req.params.id;
  //     // TODO NICE TO HAVE Check if resource with this id exists like resources/7 404 or no ?

  //     // Check if resourceId exists in hero resource ids
  //     if (
  //       !hero[this.resourceName]
  //         .map((resource) => getIdFromResourceUri(resource))
  //         .includes(resourceId)
  //     ) {
  //       logger.debug(
  //         `Forbidden access for user ${user._id} to resource /${this.resourceName}/${resourceId}`
  //       );
  //       return res.status(403).send('Forbidded');
  //     }

  //     // How to differentiate service to use??
  //     const resource = await getFilmDetailsByFilmId(resourceId);

  //     await Promise.all(
  //       film.characters.map(async (character: any, index: number) => {
  //         const characterId = getIdFromResourceUri(character);

  //         const hasAccess = user.swapiHeroId.includes(characterId);
  //         film.characters[index] = {
  //           id: characterId,
  //           name: await getPersonNameByPersonId(characterId),
  //           url: `localhost/api/people/${characterId}`,
  //           hasAccess
  //         };
  //       })
  //     );

  //     const planetService = new Planet();
  //     const heroPlanetId = getIdFromResourceUri(hero.homeworld);
  //     await Promise.all(
  //       film.planets.map(async (planet: any, index: number) => {
  //         const planetId = getIdFromResourceUri(planet);

  //         const hasAccess = heroPlanetId.includes(planetId);
  //         film.planets[index] = {
  //           id: planetId,
  //           name: await planetService.getRecordNameById(planetId),
  //           url: `localhost/api/planets/${planetId}`,
  //           hasAccess
  //         };
  //       })
  //     );

  //     const heroStarshipIds = hero.starships.map((starship) =>
  //       getIdFromResourceUri(starship)
  //     );
  //     // Mutate array with map func is not the best idea but cant use forEach here due to Promise.all
  //     await Promise.all(
  //       // TODO satisfy typescript  string | { name: string; url: string; }
  //       film.starships.map(async (starship: any, index: number) => {
  //         const starshipId = getIdFromResourceUri(starship);
  //         // Validate Starships
  //         const hasAccess = heroStarshipIds.includes(starshipId);
  //         // TODO Include url?
  //         film.starships[index] = {
  //           id: starshipId,
  //           name: await getStarshipNameByStarshipId(starshipId),
  //           url: `localhost/api/starships/${starshipId}`,
  //           hasAccess
  //         };
  //       })
  //     );

  //     const heroVehicleIds = hero.vehicles.map((vehicle) =>
  //       getIdFromResourceUri(vehicle)
  //     );
  //     await Promise.all(
  //       film.vehicles.map(async (vehicle: any, index: number) => {
  //         const vehicleId = getIdFromResourceUri(vehicle);

  //         const hasAccess = heroVehicleIds.includes(vehicleId);
  //         film.vehicles[index] = {
  //           id: vehicleId,
  //           name: await getVehicleNameByVehicleId(vehicleId),
  //           url: `localhost/api/vehicles/${vehicleId}`,
  //           hasAccess
  //         };
  //       })
  //     );

  //     const heroSpeciesIds = hero.species.map((species) =>
  //       getIdFromResourceUri(species)
  //     );
  //     await Promise.all(
  //       film.species.map(async (species: any, index: number) => {
  //         const speciesId = getIdFromResourceUri(species);

  //         const hasAccess = heroSpeciesIds.includes(speciesId);
  //         film.species[index] = {
  //           id: speciesId,
  //           name: await getSpeciesNameBySpeciesId(speciesId),
  //           url: `localhost/api/species/${speciesId}`,
  //           hasAccess
  //         };
  //       })
  //     );

  //     return res.status(200).send(film);
  //   } catch (err) {
  //     logger.error(err);
  //     return res.send(err);
  //   }
  // }

  */
}
