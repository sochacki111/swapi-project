import { Router } from 'express';

// import * as FilmController from '../controllers/film.controller';
import FilmController from  '../controllers/film.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, FilmController.findAll);
router.get('/:id', jwtAuth, FilmController.findOne);

export default router;
