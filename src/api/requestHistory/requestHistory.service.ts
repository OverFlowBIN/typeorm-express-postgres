import { AppDataSource } from '../../database/bople';
import { NextFunction, Request, Response } from 'express';
import RequestHistory from '../../entities/requestHistory.entities';

export class RequestHistoryService {
  private userRepository = AppDataSource.getRepository(RequestHistory);

  async allRequestHistorys(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return this.userRepository.find();
  }
}
