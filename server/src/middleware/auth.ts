import { Request, Response, NextFunction } from 'express';

// In a full production build, we would use firebase-admin auth.verifyIdToken() here.
// For hackathon and demo purposes, this checks authorization headers and proceeds seamlessly.
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // For demo convenience, print warning but don't block
    console.warn('Request missing authorization header. Proceeding in Demo mode.');
  }

  next();
}
