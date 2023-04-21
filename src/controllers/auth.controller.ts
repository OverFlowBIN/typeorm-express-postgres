import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import Authentication from '../entities/auth.entities';

export class AuthController {
  private authRepository = AppDataSource.getRepository(Authentication);

  // async allUsers(request: Request, response: Response, next: NextFunction) {
  //   return this.userRepository.find();
  // }
}
