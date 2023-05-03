import { AppDataSource } from '../../database/bople';
import { NextFunction, Request, Response } from 'express';
import PlannerLoginHistory from '../../entities/plannerLoginHistory.entities';

export class PlannerLoginHistoryService {
  private plannerLoginHistoryRepository =
    AppDataSource.getRepository(PlannerLoginHistory);

  async allUsers(request: Request, response: Response, next: NextFunction) {
    return this.plannerLoginHistoryRepository.find();
  }
}
