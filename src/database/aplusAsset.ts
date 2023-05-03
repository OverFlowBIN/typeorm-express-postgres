import dotenv from 'dotenv';
dotenv.config();
import oracle from 'oracledb';
oracle.outFormat = oracle.OUT_FORMAT_OBJECT;
import { Company } from '../types/enums';
import { decrypt } from '../utils/kms';

// oracle.initOracleClient({ libDir: './instantclient_21_9' });
// => oracledb 라이브러리에서 이미 초기화됨

export const initPoolOracle = async () => {
  await oracle.createPool({
    poolAlias: Company.APLUS_ASSET,
    user: process.env.APLUS_DB_USERNAME,
    password: await decrypt(process.env.APLUS_DB_PASSWORD),
    connectString: process.env.APLUS_DB_CONNECTION_STRING,
    poolMin: 15,
    poolMax: 30,
    poolIncrement: 5,
  });
};

export function getConnection(poolAlias) {
  return oracle.getConnection(poolAlias);
}
