import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import Contract from '../entities/contract.entities';

export class ContractController {
  private contractRepository = AppDataSource.getRepository(Contract);

  async allContracts(request: Request, response: Response, next: NextFunction) {
    return this.contractRepository.find();
  }
}
