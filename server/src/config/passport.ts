import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import User from '../models/user';
import logger from '../util/logger';
import {JWT_SECRET} from '../util/secrets';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

export const JwtStrategy = new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (error) {
    logger.error(error);

    return done(error);
  }
});
