import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../lib/middleware';
import { Request } from 'express';

export default withAuth(function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if user is authenticated
  const expressReq = req as unknown as Request;
  console.log(expressReq.session);
  if (!expressReq.isAuthenticated?.()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.status(200).json({ message: 'Hello World from protected API!' });
});
