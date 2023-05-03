import dotenv from 'dotenv';
dotenv.config();

/* import 3rd-party */
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import forge from 'node-forge';
import * as kms from '../../utils/kms';

/* import type */
import { SignInPayload } from './auth.types';

// TODO: 현재 사용 안됨 -> 확인 후 삭제 할 것
export const signToken = (tokenBody: string, key: string, expire: string) => {
  return sign(tokenBody, key, { expiresIn: expire });
};

export const getAuthKey = (authNumber: string, iterations: number) => {
  let digest = authNumber + process.env.CONCAT_AUTHNUMBER_SALT;
  for (let i = 0; i < iterations; i++) {
    const md = forge.md.sha512.create();
    md.update(digest);
    digest = md.digest().toHex();
  }
  return digest;
};

// TODO: 현재 통합인증으로 변경됨 -> 확인 후 삭제 할 것
// 해당 functions(sendSMS)는 firebase cloud Functions이다.
export const sendSMS = async (phone, message) => {
  const J_DATA = {
    S_PE_ID: '70000999',
    S_BIZ_GB: '007',
    S_ORG_CD: '86350000',
    S_CALLBACK: '0220095355',
    S_MSG: message,
    S_NM: 'CONCAT',
    S_SUBJECT: '',
    R_DATA: [
      {
        R_HP_NO: phone,
        R_GB: 'C',
        R_NM: '콘캣',
        R_CUST_ID: 'CONCAT',
        R_PE_ID: '',
      },
    ],
  };

  const url =
    'http://gw.aplusga.co.kr/api4home/GateWayServiceAplusBot.jsp?sn=CRMC0006&J_DATA=' +
    JSON.stringify(J_DATA);
  const encodedUrl = encodeURI(url);
  try {
    const res = await axios.post(encodedUrl);
    if (res.data.RESULT == '200') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // TODO: ERROR 처리
    // throw new AplusServerError();
    throw new Error('============ SMS Error ============');
  }
};

// FIXME: 이니시스, 다날 인증 이용한 로그인을 통해 유저 로그인 검토 로직 만들어야함 => 팀장님한테 물어보기
// 추가적으로

/**
 *  KG이니시스 통합인증 로그인
 */
export const portOne = async (imp_uid) => {
  // TODO: 들어오는 프로퍼티의 이름, 값 등이 정확한지 확인해주는 Error handler 필요
  // ex) body에 "imp_uid2"라고 들어오면 서버 멈춤
  // TODO: inputReq Type 설정하면 오류처리 어떻게 되는지 확인해 보기

  try {
    const body = {
      imp_key: process.env.IAMPORT_REST_API_KEY,
      imp_secret: process.env.IAMPORT_REST_API_SECRET_KEY,
    };

    const getToken = await axios.post(
      'https://api.iamport.kr/users/getToken',
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { access_token } = getToken.data.response;

    const getCertifications = await axios.get(
      `https://api.iamport.kr/certifications/${imp_uid}`,
      {
        headers: { Authorization: access_token },
      }
    );

    /*
      "certificationsInfo": {
        "birth": 634316400,
        "birthday": "1990-02-07",
        "certified": true,
        "certified_at": 1682404995,
        "foreigner": false,
        "foreigner_v2": null,
        "gender": null,
        "imp_uid": "imp_457930329724",
        "merchant_uid": "merchant_1682404929761",
        "name": "김영빈",
        "origin": "https://bople-clone-coding.vercel.app/",
        "pg_provider": "inicis_unified",
        "pg_tid": "INISA_MIIboplea1202304251542103940680228",
        "phone": "01054067465",
        "unique_in_site": null,
        "unique_key": "UUzMz4vRqPvkYmg4/l5zCw2hLvYDb1FUS76vnpq48H5Xyftusrp3emQEoS/JJLrciaDiSJy7E3ivHikkV5qhTg=="
      }
    */

    const certificationsInfo = getCertifications.data.response;

    return { certificationsInfo: certificationsInfo };
  } catch (err) {
    console.error(err);
    throw new Error('INVALID_USER_INFO_BY_PORTONE');
  }
};

export const generateToken = async (tokenPayload) => {
  const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

  const accessToken = sign(tokenPayload, key, { expiresIn: '3h' });
  const refreshToken = sign(tokenPayload, key, { expiresIn: '14 days' });

  return { accessToken, refreshToken };
};
