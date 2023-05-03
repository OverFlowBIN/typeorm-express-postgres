import dotenv from 'dotenv';
dotenv.config();
import { getConnection } from '../../database/aplusAsset';
import { AppDataSource } from '../../database/bople';

/* import 3rd-party */
import axios from 'axios';
import * as kms from '../../utils/kms';
import forge from 'node-forge';
import crypto from 'crypto';

/* import type */
import { Company } from '../../interfaces/enums';
import { CertificationInfoByPortOne } from './auth.types';

/* connect repository */
import { Customer } from '../../entities';
const customerRepository = AppDataSource.getRepository(Customer);

// ================================== FUNCTIONS ==================================

/**
 * userInfo를 통해 가입고객 여부 확인
 */
export const findBopleCustomer = async (
  userInfo: CertificationInfoByPortOne
) => {
  try {
    const foundUser = await customerRepository.findOneOrFail({
      where: {
        name: userInfo.certificationsInfo.name + 'a',
        phone: userInfo.certificationsInfo.phone,
        birth: userInfo.certificationsInfo.birthday.replace(/-/g, ''),
      },
    });
    return foundUser;
  } catch (err) {
    return false;
  }
};

/**
 * AplusDB를 통해 설계사의 로그인 가능여부 확인
 */
export async function signInByAplusByDB({ plannerId, password, phone, appId }) {
  // const { } = req.body;

  const connection = await getConnection(Company.APLUS_ASSET);

  try {
    const md = forge.md.sha256.create();
    md.update(password);
    const encPassword = md.digest().toHex();

    const result = await connection.execute(
      `
      SELECT
        PE.PE_ID
        , PE.PE_KNM        AS SS_USER_NM
        , PE.HP            AS SS_HP_NO
        , PE.BRAN_CD       AS SS_BRAN_CD
        , PE.BRAN_NM       AS SS_BRAN_NM
        , PE.BON_NM        AS SS_BONBU_NM
        , PE.임직원직책    AS NEW_DUTY_GB
      FROM V_APLUS_PE PE
      WHERE PE.USE_YN  = 'Y'
      AND PE.PE_ID   = :plannerId
      AND PE.PSWD    = :password
      AND PE.HP LIKE '%'|| :phone
      `,
      {
        plannerId,
        password: encPassword,
        phone,
      }
    );
    if (result.rows.length > 0) {
      // console.log(result.rows);
      return true;
    } else {
      // console.log(result.rows);
      // FIXME: DB에서 못찾았을떄 gw.aplusga.co.kr로 axios 보내는데 이유가..?
      return await signInByAplusApi({
        plannerId,
        password,
        phone,
        appId,
      });
    }
  } catch (error) {
    return false;
  } finally {
    await connection.release();
  }
}

// FIXME: 왜 디비에서 찾기(signInByAplusByDB)가 있고 axios로 찾는 2개가 있는가?
// 서버에 직접 쏘지 말라고 했었음.
// 그래서 URL을 파줬었음
// 현재는 그냥쏘는것도 되긴 하는데 안되는 경우도 있어서 예전에 만들어 준 URL에 추가적으로 다시 쏴서
// 확인하는 식으로 변경됨 -> 히스토리가 ... 이상함 ㅠ
/**
 * Aplus api를 통해 설계사의 로그인 가능여부 확인 (decoding key 잦은 변경으로 인해 로그인 안되는 경우가 많음)
 */
export async function signInByAplusApi({ plannerId, password, phone, appId }) {
  try {
    const key1 = await encryptAplusData([phone, appId, plannerId].join(','));
    const key2 = await encryptAplusData(password);

    const { data } = await axios.get(
      `http://gw.aplusga.co.kr/android/hp_LoginProc3.jsp?key=${key1}&key2=${key2}`,
      {
        timeout: 2000,
      }
    );

    const statusCode = parseInt(data[0].RESULT, 10);
    if (statusCode !== 200) {
      console.log('signInByAplus false');
      return false;
    } else {
      console.log('signInByAplus true');
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const encryptAplusData = async (data: string) => {
  const apiKey = await kms.decrypt(process.env.APLUS_API_ACCESS_KEY);
  const keyBytes = Buffer.from(apiKey, 'hex');

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBytes, keyBytes);

  const cipher1 = cipher.update(data);
  const cipher2 = cipher.final();

  const base64Encoded = Buffer.concat([cipher1, cipher2]).toString('base64');

  return encodeURIComponent(base64Encoded);
};

export const decryptAplusData = async (encodedMsg: string) => {
  const apiKey = await kms.decrypt(process.env.APLUS_API_ACCESS_KEY);
  const keyBytes = Buffer.from(apiKey, 'hex');
  try {
    const encryptedMsg = decodeURIComponent(encodedMsg.trim());
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBytes, keyBytes);
    const cipher1 = decipher.update(encryptedMsg, 'base64');
    const cipher2 = decipher.final();
    const plainText = Buffer.concat([cipher1, cipher2]).toString('utf8');
    return JSON.parse(plainText);
  } catch (err) {
    console.error(err);
    throw new Error('APLUS_INVALID_RETURN_ERROR');
  }
};
