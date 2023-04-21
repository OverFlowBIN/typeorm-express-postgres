import { AppDataSource } from '../database/data-source';
import * as express from 'express';
import Request from '../entities/request.entities';

export class RequestController {
  private requestRepository = AppDataSource.getRepository(Request);

  async allRequests(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    return this.requestRepository.find();
  }
}
