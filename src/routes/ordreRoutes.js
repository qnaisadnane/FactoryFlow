import { Router } from 'express';
import { OrdreFabricationController } from '../controllers/OrdreFabricationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// POST & GET /api/ordres (Admin uniquement)
router.post('/', requireRole('admin'), OrdreFabricationController.create);
router.get('/', requireRole('admin'), OrdreFabricationController.getAll);
router.get('/:id', requireRole('admin'), OrdreFabricationController.getById);
router.put('/:id', requireRole('admin'), OrdreFabricationController.update);
router.delete('/:id', requireRole('admin'), OrdreFabricationController.cancel);

// Démarrage par l'opérateur assigné
router.post('/:id/demarrer', requireRole('operateur', 'admin'), OrdreFabricationController.demarrer);

export default router;




