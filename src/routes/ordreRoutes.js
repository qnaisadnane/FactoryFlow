import { Router } from 'express';
import { OrdreFabricationController } from '../controllers/OrdreFabricationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// POST & GET /api/ordres (Admin uniquement)
router.post('/', requireRole('admin'), OrdreFabricationController.create);
router.get('/', requireRole('admin'), OrdreFabricationController.getAll);

export default router;

