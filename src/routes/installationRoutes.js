import { Router } from 'express';
import { InstallationController } from '../controllers/InstallationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/status', InstallationController.getStatus);
router.post('/', requireRole('admin'), InstallationController.installer);

export default router;
