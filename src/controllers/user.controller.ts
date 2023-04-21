import { AppDataSource } from '../database/data-source';
import { NextFunction, Request, Response } from 'express';
import User from '../entities/user.entities';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async allUsers(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async addUser(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.create();
  }

  // async oneUser(request: Request, response: Response, next: NextFunction) {
  //   const id = parseInt(request.params.id);
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //   });

  //   if (!user) {
  //     console.log(
  //       '🚀 ~ file: UserController.ts:17 ~ UserController ~ oneUser ~ user:',
  //       user
  //     );
  //     return 'unregistered user';
  //   } else {
  //     return user;
  //   }
  // }

  // async saveUser(request: Request, response: Response, next: NextFunction) {
  //   const { firstName, lastName, age } = request.body;
  //   const user = Object.assign(new User(), {
  //     firstName,
  //     lastName,
  //     age,
  //   });
  //   return this.userRepository.save(user);
  // }

  // async createAndSaveUser(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //   const { firstName, lastName, age } = request.body;
  //   console.log(
  //     '==============================================================='
  //   );
  //   console.log('firstName, lastName, age', { firstName, lastName, age });

  //   for (let i = 0; i < 10; i++) {
  //     this.userRepository.create({ firstName, lastName, age: age + i });
  //   }
  //   console.log('this.userRepository', this.userRepository);
  //   return;
  //   // const user = Object.assign(new User(), {
  //   //   firstName,
  //   //   lastName,
  //   //   age,
  //   // });
  //   //return this.userRepository.save(user);
  // }

  // async removeUser(request: Request, response: Response, next: NextFunction) {
  //   const id = parseInt(request.params.id);
  //   let userToRemove = await this.userRepository.findOneBy({ id });
  //   if (!userToRemove) {
  //     return 'this user not exist';
  //   }
  //   await this.userRepository.remove(userToRemove);
  //   return 'user has been removed';
  // }
}
