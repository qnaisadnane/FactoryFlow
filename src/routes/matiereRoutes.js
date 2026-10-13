import { Router } from 'express';
import { MatierePremiereController } from '../controllers/MatierePremiereController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Routes réservées aux admins
router.use(authMiddleware);
router.use(requireRole('admin'));

// CRUD des matières premières
router.post('/', MatierePremiereController.create);
router.get('/', MatierePremiereController.getAll);
router.get('/:id', MatierePremiereController.getById);
router.put('/:id', MatierePremiereController.update);
router.post('/:id/entrees', MatierePremiereController.ajouterEntree);

export default router;

