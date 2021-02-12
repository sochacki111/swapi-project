import { Router } from 'express';

import SpeciesController from  '../controllers/species.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, SpeciesController.findAll);
router.get('/:id', jwtAuth, SpeciesController.findOne);

export default router;
