import { User } from '../entities';
import { Request, Response } from 'express';
export interface IContext {
  request?: Request;
  response?: Response;
  token?: string;
  user?: User;
  codef_token?: string;
}

export default IContext;
