import { AppDataSource } from '../../database/bople';
import express from 'express';
import Request from '../../entities/request.entities';

export class RequestService {
  private requestRepository = AppDataSource.getRepository(Request);

  async allRequests(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    return this.requestRepository.find();
  }
}
