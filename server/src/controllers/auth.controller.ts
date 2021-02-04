import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { JWT_SECRET, TOKEN_TIMEOUT } from '../util/secrets';

function createToken(user: IUser) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_TIMEOUT
  });
}

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: { message: 'Please send your email and password' } });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ error: { message: 'The User already exists' } });
  }

  // TODO Fetch random
  const randomHeroId: string = '1';
  const { data } = await axios.get(
    `https://swapi.dev/api/people/${randomHeroId}`
  );

  const newUser = new User({...req.body, swapiHeroId: randomHeroId});
  await newUser.save();
  return res.status(201).json({ newUser, data });
};

export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: { message: 'Please. Send your email and password' } });
  }

  const user = await User.findOne({ email: req.body.email });
  console.log(user?.toJSON());
  if (!user) {
    return res
      .status(400)
      .json({ error: { message: 'The User does not exists' } });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    return res.status(200).json({
      idToken: createToken(user),
      localId: user._id,
      userEmail: user.email,
      expiresIn: TOKEN_TIMEOUT
    });
  }

  return res.status(400).json({
    error: {
      message: 'The email or password are incorrect'
    }
  });
};
