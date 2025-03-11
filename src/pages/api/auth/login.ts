import { NextApiRequest, NextApiResponse } from 'next';
import { passport } from '../../../lib/auth';
import { withAuth } from '../../../lib/middleware';
import { Request } from 'express';

export default withAuth(function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    passport.authenticate('saml', {
      failureRedirect: '/',
      failureFlash: true,
      keepSessionInfo: true,
    })(req as unknown as Request, res, (err: Error | null) => {
      if (err) {
        console.error('SAML auth error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
