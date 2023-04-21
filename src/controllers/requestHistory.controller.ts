import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import RequestHistory from '../entities/requestHistory.entities';

export class RequestHistoryController {
  private userRepository = AppDataSource.getRepository(RequestHistory);

  async allRequestHistorys(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return this.userRepository.find();
  }
}
