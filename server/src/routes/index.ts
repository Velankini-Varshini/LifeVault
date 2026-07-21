import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// API Version 1 Routes (/api/v1)
router.use('/', healthRoutes);

export default router;
