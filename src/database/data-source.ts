import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  User,
  Authentication,
  Contract,
  Customer,
  Planner,
  PlannerLoginHistory,
  PlannerReferralHistory,
  Request,
  RequestHistory,
} from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'dudqls12',
  database: 'postgres',
  schema: 'AplusAsset', // schema 설정은 안해주면 public으로 자동 설정 된다.
  synchronize: false, // TODO: DB 생성때는 true 확정후에는 false로 바꾸기
  logging: false,
  entities: [
    User,
    Authentication,
    Contract,
    Customer,
    Planner,
    PlannerLoginHistory,
    PlannerReferralHistory,
    Request,
    RequestHistory,
  ],
  migrations: [],
  subscribers: [],
});
