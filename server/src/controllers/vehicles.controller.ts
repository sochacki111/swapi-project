import { Request, Response, NextFunction } from 'express';

import logger from '../util/logger';
import { getIdFromResourceUri } from '../util/misc';
import PlanetsService from '../services/planets.service';
import SpeciesService from '../services/species.service';
import StarshipsService from '../services/starship.service';
import VehiclesService from '../services/vehicles.service';
import PeopleService from '../services/people.service';
import FilmsService from '../services/films.service';

class VehiclesController {
  private static instance: VehiclesController;

  static getInstance() {
    if (!VehiclesController.instance) {
      VehiclesController.instance = new VehiclesController();
    }
    return VehiclesController.instance;
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

      const heroVehicleIds = hero.vehicles.map((vehicle: string) =>
        getIdFromResourceUri(vehicle)
      );

      const vehiclesService = new VehiclesService();
      const vehicles = await Promise.all(
        heroVehicleIds.map(async (vehicleId: string) => ({
          id: vehicleId,
          name: await vehiclesService.getRecordNameById(vehicleId)
        }))
      );
      return res.status(200).send(vehicles);
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
        !hero.vehicles
          .map((vehicle: string) => getIdFromResourceUri(vehicle))
          .includes(resourceId)
      ) {
        logger.debug(
          `Forbidden access for user ${user.email} to resource /vehicles/${resourceId}`
        );
        return res.status(403).send('Forbidded');
      }

      const vehiclesService = new VehiclesService();
      const vehicle = await vehiclesService.getDetailsById(resourceId);

      await Promise.all(
        vehicle.pilots.map(async (pilot: string, index: number) => {
          const pilotId = getIdFromResourceUri(pilot);

          const hasAccess = user.swapiHeroId.includes(pilotId);
          vehicle.pilots[index] = {
            id: pilotId,
            name: await peopleService.getRecordNameById(pilotId),
            hasAccess
          };
        })
      );

      const filmsService = new FilmsService();
      const heroFilmIds = hero.films.map((film: string) =>
        getIdFromResourceUri(film)
      );
      await Promise.all(
        vehicle.films.map(async (film: string, index: number) => {
          const filmId = getIdFromResourceUri(film);
          const hasAccess = heroFilmIds.includes(filmId);
          vehicle.films[index] = {
            id: filmId,
            name: await filmsService.getRecordNameById(filmId),
            hasAccess
          };
        })
      );

      return res.status(200).send(vehicle);
    } catch (err) {
      logger.error(err);
      return res.send(err);
    }
  };
}

export default VehiclesController.getInstance();
