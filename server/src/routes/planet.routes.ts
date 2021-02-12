import { Router } from 'express';

import PlanetsController from  '../controllers/planets.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, PlanetsController.findAll);
router.get('/:id', jwtAuth, PlanetsController.findOne);

export default router;
