import { Router } from 'express';
import { BotController } from '../controllers/botController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.post('/chat', BotController.chat);
router.get('/status', BotController.status);

export default router;
