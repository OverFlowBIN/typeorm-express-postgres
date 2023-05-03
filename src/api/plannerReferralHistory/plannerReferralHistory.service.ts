import { AppDataSource } from '../../database/bople';
import { NextFunction, Request, Response } from 'express';
import PlannerReferralHistory from '../../entities/plannerReferralHistory.entities';

export class PlannerReferralHistoryService {
  private plannerReferralHistoryRepository = AppDataSource.getRepository(
    PlannerReferralHistory
  );

  async allPlannerReferralHistorys(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return this.plannerReferralHistoryRepository.find();
  }
}
