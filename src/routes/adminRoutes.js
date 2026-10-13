import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Toutes les routes admin nécessitent authentification et rôle admin
router.use(authMiddleware);
router.use(requireRole('admin'));

// POST /api/admin/users - Création d'un compte (admin ou operateur)
router.post('/users', AuthController.createUser);

export default router;
