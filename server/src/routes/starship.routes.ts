import { Router } from 'express';

import StarshipsController from  '../controllers/starships.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

router.get('/', jwtAuth, StarshipsController.findAll);
router.get('/:id', jwtAuth, StarshipsController.findOne);

export default router;
