import { UserController } from './controller/UserController';

export const Routes = [
  {
    method: 'get',
    route: '/users',
    controller: UserController,
    action: 'allUsers',
  },
  {
    method: 'get',
    route: '/users/:id',
    controller: UserController,
    action: 'oneUser',
  },
  {
    method: 'post',
    route: '/users',
    controller: UserController,
    action: 'saveUser',
  },
  {
    method: 'post',
    route: '/users/test',
    controller: UserController,
    action: 'createAndSaveUser',
  },
  {
    method: 'delete',
    route: '/users/:id',
    controller: UserController,
    action: 'removeUser',
  },
];
