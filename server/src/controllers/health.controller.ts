import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { env } from '../config/env.config';

export class HealthController {
  public static getHealth = (req: Request, res: Response) => {
    const healthInfo = {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      memoryUsage: process.memoryUsage(),
    };
    return ApiResponse.success(res, 200, 'Server is healthy and operational', healthInfo);
  };

  public static getStatus = (req: Request, res: Response) => {
    const statusInfo = {
      serviceName: 'LifeVault AI Engine',
      apiVersion: 'v1',
      environment: env.NODE_ENV,
      configuredServices: {
        database: Boolean(env.DATABASE_URL),
        firebase: Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL),
        cloudinary: Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY),
        gemini: Boolean(env.GEMINI_API_KEY),
        resend: Boolean(env.RESEND_API_KEY),
      },
      systemTime: new Date().toISOString(),
    };
    return ApiResponse.success(res, 200, 'System status report', statusInfo);
  };
}
