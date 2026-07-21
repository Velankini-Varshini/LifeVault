import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

router.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    apiVersion: 'v1',
    server: 'running'
  });
});

export default router;
