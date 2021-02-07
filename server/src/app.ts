import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import { JwtStrategy } from './config/passport';
import logger from './util/logger';
import { MONGODB_URI } from './util/secrets';
import authRoutes from './routes/auth.routes';
import filmRoutes from './routes/film.routes';

// Create a new express app instance
const app: Application = express();

// Connect to MongoDB
// TODO async/await
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    logger.debug('DB connected!');
  })
  .catch((err) => {
    logger.fatal(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    process.exit();
  });

// Middlewares
app.use(cors());
app.use(passport.initialize());
app.use(morgan('dev'));

// Passport configuration
passport.use(JwtStrategy);

// Express configuration
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
// TODO Nice to have /api/...
app.use(authRoutes);
app.use('/api/films', filmRoutes);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

export default app;
