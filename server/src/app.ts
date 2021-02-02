import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import logger from './util/logger';
import { MONGODB_URI } from './util/secrets';

// Create a new express app instance
const app: Application = express();

// Connect to MongoDB
const mongoUrl = String(MONGODB_URI);

// TODO Try async/await
mongoose
  .connect(mongoUrl, {
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
app.use(morgan('dev'));

// Express configuration
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

export default app;
