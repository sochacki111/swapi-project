import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';

import logger from '../util/logger';
import User from '../models/user';
import { IHero } from '../intefaces/IHero';
import {
  getHeroDetailsByHeroId,
  getHeroFilmIdsByHeroId
} from '../services/hero.service';
import { getStarshipNameByStarshipId } from '../services/starship.service';
import getFilmDetailsByFilmId from '../services/film.service';
import { getIdFromResourceUri } from '../util/misc';

declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      swapiHeroId: string;
    }
  }
}

// TODO Refactor const { user } = req;
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
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

    // TODO fix eslint
    const films = await Promise.all(
      heroFilmIds.map(async (filmId) => await getFilmDetailsByFilmId(filmId))
    );
    return res.status(200).send(films);
  } catch (err) {
    return res.send(err);
  }
};

// TODO Make this function as one for every resource? Can it be abstracted ?
export const findOne = async (
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
    const hero: IHero = await getHeroDetailsByHeroId(user.swapiHeroId);

    const filmId = req.params.id;
    // TODO NICE TO HAVE Check if film with this id exists like films/7 404 or no ?

    // Check if filmId exists in film ids
    if (
      !hero.films.map((film) => getIdFromResourceUri(film)).includes(filmId)
    ) {
      logger.debug(
        `Forbidden access for user ${user._id} to resource /films/${filmId}`
      );
      return res.status(403).send('Forbidded');
    }

    const film = await getFilmDetailsByFilmId(filmId);
    const heroStarshipIds = hero.starships.map((starship) =>
      getIdFromResourceUri(starship)
    );

    // Mutate array with map func is not the best idea but cant use forEach here due to Promise.all
    await Promise.all(
      // TODO satisfy typescript  string | { name: string; url: string; }
      film.starships.map(async (starship: any, index: number) => {
        const starshipId = getIdFromResourceUri(starship);
        // Validate Starships
        const hasAccess = heroStarshipIds.includes(starshipId);
        // TODO Include url?
        film.starships[index] = {
          id: starshipId,
          name: await getStarshipNameByStarshipId(starshipId),
          url: `localhost/api/starship/${starshipId}`,
          hasAccess
        };
      })
    );

    return res.status(200).send(film);
  } catch (err) {
    logger.error(err);
    return res.send(err);
  }
};
