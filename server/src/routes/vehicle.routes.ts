import { Router } from 'express';

import VehiclesController from  '../controllers/vehicles.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, VehiclesController.findAll);
router.get('/:id', jwtAuth, VehiclesController.findOne);

export default router;
