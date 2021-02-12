import { Router } from 'express';

import FilmsController from  '../controllers/films.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, FilmsController.findAll);
router.get('/:id', jwtAuth, FilmsController.findOne);

export default router;
