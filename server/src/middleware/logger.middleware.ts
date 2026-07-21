import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const url = req.url;
  const time = new Date().toISOString();
  
  console.log(`[${time}] ${method} ${url}`);
  next();
};

export default loggerMiddleware;
