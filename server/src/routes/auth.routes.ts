import { Router } from 'express';
import { signIn, register } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/signin', signIn);

export default router;
