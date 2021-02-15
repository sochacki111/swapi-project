import { Server } from 'http';
import logger from './util/logger';
import app from './app';
import mongoose from 'mongoose';
import { MONGODB_URI } from './util/secrets';

// Connect to MongoDB
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


const server: Server = app.listen(app.get('port'), () => {
  logger.debug(`App is listening on port ${app.get('port')}!`);
});

export default server;
