import { NextApiRequest, NextApiResponse } from 'next';
import session from 'express-session';
import { passport, authConfig } from './auth';
import { Request, Response, NextFunction } from 'express';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Initialize session
      await new Promise<void>((resolve, reject) => {
        session({
          secret: authConfig.secret,
          resave: false,
          saveUninitialized: false,
          cookie: authConfig.cookie,
        })(req as unknown as Request, res as unknown as Response, ((err: unknown) => {
          if (err) reject(err);
          resolve();
        }) as NextFunction);
      });

      // Initialize passport
      await new Promise<void>((resolve, reject) => {
        passport.initialize()(req as unknown as Request, res as unknown as Response, ((err: unknown) => {
          if (err) reject(err);
          resolve();
        }) as NextFunction);
      });

      // Initialize passport session
      await new Promise<void>((resolve, reject) => {
        passport.session()(req as unknown as Request, res as unknown as Response, ((err: unknown) => {
          if (err) reject(err);
          resolve();
        }) as NextFunction);
      });

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
