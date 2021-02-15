import express, { Application } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { JwtStrategy } from './config/passport';
import authRoutes from './routes/auth.routes';
import filmRoutes from './routes/film.routes';
import starshipRoutes from './routes/starship.routes';
import vehicleRoutes from './routes/vehicle.routes';
import speciesRoutes from './routes/species.routes';
import planetRoutes from './routes/planet.routes';
import swaggerDocs from './config/swagger';

// Create a new express app instance
const app: Application = express();

// Middlewares
app.use(cors());
app.use(passport.initialize());
app.use(morgan('dev'));

// Passport configuration
passport.use(JwtStrategy);

// Express configuration
declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      swapiHeroId: string;
    }
  }
}

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/starships', starshipRoutes);
app.use('/api/planets', planetRoutes);

export default app;
