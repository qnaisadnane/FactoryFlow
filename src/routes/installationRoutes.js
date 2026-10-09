import { Router } from 'express';
import { InstallationController } from '../controllers/InstallationController.js';

const router = Router();

router.get('/status', InstallationController.getStatus);
router.post('/', InstallationController.installer);

export default router;
