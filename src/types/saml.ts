import { Request } from 'express';

export interface RequestWithUser extends Request {
  samlLogoutRequest?: string;
  user?: {
    nameID?: string;
    nameIDFormat?: string;
    sessionIndex?: string;
  };
}
