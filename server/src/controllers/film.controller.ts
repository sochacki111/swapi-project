import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';

import logger from '../util/logger';
import User from '../models/user';
import { IHero } from '../intefaces/IHero';
import { getHeroById } from '../services/swapi';
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
    // GET Request Films
    const { data } = await axios.get(`https://swapi.dev/api/films`);
    // foundFilms
    return res.status(200).send(data);
  } catch (err) {
    return res.send(err);
  }
};

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
    const hero: IHero = await getHeroById(user.swapiHeroId);

    const filmId = req.params.id;
    // TODO Check if film with this id exists like films/7 404 or no ?

    // Check if filmId exists in film ids
    if (
      !hero.films
        .map((film) => {
          return getIdFromResourceUri(film);
        })
        .includes(filmId)
    ) {
      logger.debug(
        `Forbidden access for user ${user._id} to resource /films/${filmId}`
      );
      return res.status(403).send('Forbidded');
    }

    const { data } = await axios.get(
      `https://swapi.dev/api/films/${req.params.id}`
    );

    return res.status(200).send(data);
  } catch (err) {
    logger.error(err);
    return res.send(err);
  }
};
