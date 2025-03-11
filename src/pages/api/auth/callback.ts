import { NextApiRequest, NextApiResponse } from 'next';
import { passport } from '../../../lib/auth';
import { withAuth } from '../../../lib/middleware';
import { Request } from 'express';

export default withAuth(function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    passport.authenticate('saml', {
      failureRedirect: '/',
      failureFlash: true,
      keepSessionInfo: true,
    })(req as unknown as Request, res, (err: Error | null) => {
      if (err) {
        console.error('SAML callback error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }
      
      // Successful authentication
      const expressReq = req as unknown as Request;
      if (expressReq.user) {
        console.log('User authenticated:', expressReq.user);
        return res.redirect('/');
      } else {
        console.error('No user data in request');
        return res.status(500).json({ error: 'Authentication failed' });
      }
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
