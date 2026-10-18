import { Router } from 'express';
import { ProduitController } from '../controllers/ProduitController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('admin'));

router.post('/', ProduitController.create);
router.get('/', ProduitController.getAll);
router.get('/:id', ProduitController.getById);
router.put('/:id', ProduitController.update);

export default router;


