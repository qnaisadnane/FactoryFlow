import { Router } from 'express';
import { OrdreFabricationController } from '../controllers/OrdreFabricationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Consultation de ses propres ordres (Opérateur connecté)
router.get('/mes-ordres', requireRole('operateur', 'admin'), OrdreFabricationController.getMesOrdres);

// POST & GET /api/ordres (Admin uniquement)
router.post('/', requireRole('admin'), OrdreFabricationController.create);
router.get('/', requireRole('admin'), OrdreFabricationController.getAll);

router.get('/:id', requireRole('admin'), OrdreFabricationController.getById);
router.put('/:id', requireRole('admin'), OrdreFabricationController.update);
router.delete('/:id', requireRole('admin'), OrdreFabricationController.cancel);

// Démarrage et terminaison par l'opérateur assigné
router.post('/:id/demarrer', requireRole('operateur', 'admin'), OrdreFabricationController.demarrer);
router.post('/:id/terminer', requireRole('operateur', 'admin'), OrdreFabricationController.terminer);

export default router;





