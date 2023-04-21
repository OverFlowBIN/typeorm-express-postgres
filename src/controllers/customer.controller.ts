import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import Customer from '../entities/customer.entities';

export class CustomerController {
  private customerRepository = AppDataSource.getRepository(Customer);

  async allCustomers(request: Request, response: Response, next: NextFunction) {
    return this.customerRepository.find();
  }
}
