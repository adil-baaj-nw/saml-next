import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/middleware';
import { Request } from 'express';

export default withAuth(function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the session
    (req as unknown as Request).session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Error during logout' });
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Error during logout' });
  }
});
