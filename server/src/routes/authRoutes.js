import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();
console.log('✅ AUTH ROUTES MOUNTED');
router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);
router.post('/register', AuthController.register);

export default router;
