import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import Planner from '../entities/planner.entities';

export class PlannerController {
  private plannerRepository = AppDataSource.getRepository(Planner);

  async allPlanners(request: Request, response: Response, next: NextFunction) {
    return this.plannerRepository.find();
  }
}
