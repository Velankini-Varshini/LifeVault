import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No authorization token provided.');
    }
    // Firebase Admin authentication verification will be activated in subsequent milestone.
    next();
  } catch (error) {
    next(error);
  }
};
