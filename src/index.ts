import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Routes } from './routes';
import User from './entities/user';
const PORT = 3330;

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(PORT, () => {
      console.log(
        `Express server has started on port ${PORT}. Open http://localhost:${PORT}/users to see results`
      );
    });

    // // insert new users for test
    // await AppDataSource.manager.save(
    //   AppDataSource.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     age: 27,
    //   })
    // );

    // const userRepository = AppDataSource.getRepository(User);

    // const user1 = new User();
    // user1.firstName = 'youngbin';
    // user1.lastName = 'kim';
    // user1.age = 33;
    // await userRepository.save(user1);

    // const allUsers = await userRepository.find();
    // console.log('🚀 ~ file: index.ts:72 ~ .then ~ allUsers:', allUsers);

    // const firstUser = await userRepository.findOneBy({
    //   id: 1,
    // });
    // console.log('🚀 ~ file: index.ts:77 ~ .then ~ firstUser:', firstUser);

    // const timber = await userRepository.findOneBy({
    //   firstName: 'Timber',
    //   lastName: 'Saw',
    // });
    // console.log('🚀 ~ file: index.ts:83 ~ .then ~ timber:', timber);
  })
  .catch((error) => console.log(error));
