import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from '../../database/bople';
import { getConnection } from '../../database/aplusAsset';
import { NextFunction, Request, Response } from 'express';

/* import service & util */
import { getPlannerInfo } from '../planner/planner.service';
import { signInByAplusByDB, findBopleCustomer } from './auth.service';
import { getAuthKey, sendSMS, portOne, generateToken } from './auth.util';

/* import 3rd-party */
import axios from 'axios';
import * as kms from '../../utils/kms';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

/* import type */
import { Company, Provider, UserRole } from '../../interfaces/enums';
import {
  CertificationInfoByPortOne,
  UpdateCustomerInfoInput,
  RefreshAccessTokenPayload,
} from './auth.types';

/* connect repository */
import { User, Planner, PlannerLoginHistory, Customer } from '../../entities';

const userRepository = AppDataSource.getRepository(User);
const plannerLoginHistoryRepository =
  AppDataSource.getRepository(PlannerLoginHistory);
const plannerRepository = AppDataSource.getRepository(Planner);
const customerRepository = AppDataSource.getRepository(Customer);

/**
 * 고객 본인인증 인증번호를 전송
 */
// TODO: 로그인시 인증번호 그대로 사용 X => 이니시스 통합 인증 / 다날 인증으로 변경
// 현재 front에서 firebase를 통해 처리됨
export async function sendAuthCode(req: Request, res: Response) {
  const { userId, phone } = req.body;

  // crypto-random-string -> cyrpyto.random
  const authNumber = crypto.randomInt(100000, 999999).toString();
  console.log('authNumber', authNumber);

  const authKey = getAuthKey(authNumber, 428);

  // try {
  //   // bople authentication table에서 해당 유저를 찾으면 update 못찾으면 insert
  //   const auth = await transaction.findOneOrFail(Authentication, {
  //     userId,
  //     phone,
  //   });
  //   await transaction.update(
  //     Authentication,
  //     {
  //       userId,
  //       phone,
  //     },
  //     {
  //       authKey,
  //       authorizedAt: null,
  //     }
  //   );
  // } catch (err) {
  //   await transaction.insert(Authentication, {
  //     userId,
  //     phone,
  //     authKey,
  //     authorizedAt: null,
  //   });
  // }

  const success = await sendSMS(
    phone,
    `(보플) 인증번호는 ${authNumber} 입니다.`
  );
  return res.send({ success });
}

/**
 * 전송된 본인인증 번호와 DB를 대조하여 본인인증 수행
 */
// TODO: 로그인시 인증번호 그대로 사용 X => 이니시스 통합 인증 / 다날 인증으로 변경
// TODO: 해당 TABLE 삭제해도 되지 않나?
// 현재 next에서 firebase를 통해 처리됨
export async function verifyAuthCode(req: Request, res: Response) {
  const { userId, phone, authKey } = req.body;
  try {
    // const auth = await transaction.findOneOrFail(Authentication, {
    //   where: {
    //     userId,
    //     phone,
    //     authKey,
    //     authorizedAt: null,
    //   },
    // });
    // await transaction.update(
    //   Authentication,
    //   {
    //     userId,
    //     phone,
    //     authKey,
    //   },
    //   {
    //     authorizedAt: "NOW()",
    //   }
    // );
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false });
  }
}

/**
 * 고객 로그인
 */
export const signInCustomer = async (req: Request, res: Response) => {
  const { imp_uid } = req.body;

  const userInfo: CertificationInfoByPortOne = await portOne(imp_uid);

  // 1. userInfo를 통해 가입 고객 여부 확인 -> findCustomer()
  const foundUser = await findBopleCustomer(userInfo);
  // TODO: ci값 DB 저장 시 AES 보안 적용하기

  // 1-1. 가입된 고객인 경우 바로 토큰 전송
  if (foundUser) {
    // TODO: userRepository에 저장해야하는지?
    // TODO: CustomerHistory 추가해야 하는지?

    const tokenPayload = {
      id: foundUser.customerId,
      role: UserRole.PLANNER,
    };

    const { accessToken, refreshToken } = await generateToken(tokenPayload);

    return res.send({
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  }
  // 1-2. 가입안된 고객인 경우 본인 정보 입력 페이지
  throw new Error('NOT_REGISTERD_MEMBER_AT_BOPLE');
};

/**
 * 2.입력된 정보를 보플 서버, 에셋 서버에 저장(???) 후 토큰 전송
 */
export const inputCustomerData = async (
  req: Request<UpdateCustomerInfoInput>,
  res: Response
) => {
  const { tfaId, name, birth, sex, email, phone, address, addressDetail } =
    req.body;
  console.log('req.body: ', req.body);

  // TODO: request 로직 정확히 이해하기!
  // TODO: 로그인 로직 검토 후 확정 나면 추가하기!!!
  // TODO: 로그인 로직 검토 후 확정 나면 추가하기!!!
  // TODO: 로그인 로직 검토 후 확정 나면 추가하기!!!
  // TODO: 로그인 로직 검토 후 확정 나면 추가하기!!!

  // const userInfo = customerRepository.create({
  //   name,
  //   birth,
  //   sex,
  //   email,
  //   phone,
  // });

  // 2-1. 보플 DB에 입력 정보 넣기
  // try {
  //   await customerRepository.save(userInfo);
  // } catch (err) {
  //   console.error(err);
  // }

  // 2-2. 에셋 DB에 입력 정보 넣기
};

// ============================================== TFA ==============================================

interface ISignTFAReq {
  plannerId: string;
  password: string;
  phone: string;
  appId: string;
}

// FIXME: appId 용도?
// appId (device id) : a2URez3jIjaW

// // TODO: 안쓰고있는 func
// @Mutation(returns => SignInPayload)
// public async signInByKCredit(@Args()
// {
//   userId,
//   authKey
// }: SignInByKCreditArgs): Promise<SignInPayload> {
//   let user;
//   try {
//     user = await this.userRepository.findOneOrFail({
//       where: {
//         userId,
//         authKey
//       }
//     });
//   } catch (err) {
//     throw new InvalidUserAccountError();
//   }

//   const tokenPayload = {
//     id: user.userId,
//     role: user.role
//   };

//   const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

//   const accessToken = sign(tokenPayload, key, { expiresIn: '30000h' });
//   const refreshToken = sign(tokenPayload, key, { expiresIn: '12h' });

//   await this.userRepository.update(user.userId, {
//     refreshToken,
//     lastLoggedIn: 'NOW()'
//   });

//   return {
//     accessToken,
//     refreshToken
//   };
// }

/**
 * 설계사 로그인
 */
export const signInByAplus = async (req: Request, res: Response) => {
  const { plannerId, password, phone, appId } = req.body;

  const success = await signInByAplusByDB({
    plannerId,
    password,
    phone,
    appId,
  });

  if (!success) {
    throw new Error('INVALID_USER_ACCOUNT_ERROR');
  }

  const provider = Provider.APLUS_ASSET;
  const providerUserId = plannerId;
  const userId = `${provider}:${providerUserId}`;

  const userObj = userRepository.create({
    userId,
    provider,
    providerUserId,
    role: UserRole.PLANNER,
  });

  const user = await userRepository.save(userObj);

  const tokenPayload = {
    // TODO: ci 값 추가하기 ??
    id: userId,
    role: UserRole.PLANNER,
  };
  const { accessToken, refreshToken } = await generateToken(tokenPayload);

  await userRepository.update(user.userId, {
    refreshToken,
    lastLoggedIn: 'NOW()',
  });

  try {
    await plannerLoginHistoryRepository.save({
      plannerId: plannerId,
      appId: appId,
    });
  } catch (err) {
    const rows = await getPlannerInfo(Company.APLUS_ASSET, plannerId);

    if (rows.length > 0) {
      try {
        const plannerObj = plannerRepository.create(rows[0]);
        await plannerRepository.insert(plannerObj);
        await plannerLoginHistoryRepository.save({
          plannerId: plannerId,
          appId: appId,
        });
      } catch (err) {
        throw new Error('CANT_CREATE_PLANNER_LOGIN_HISTORY');
      }
    } else {
      throw new Error('CANT_FIND_APLUS_PLANNER_ERROR');
    }
  }

  await plannerRepository.update(
    { installed: false, plannerId: plannerId },
    { installed: true, installedAt: 'NOW()' }
  );

  return res.send({
    success: true,
    data: {
      accessToken,
      refreshToken,
    },
  });
};

/**
 * 기존의 refresh token으로 access token을 업데이트 합니다.
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  // let isValid = true;
  // let accessToken = '';
  // let refreshToken = '';

  const { prevRefreshToken, appId } = req.body;
  let tokenPayload: { id: string; role: string };
  let key: string;
  let plannerId: string;

  try {
    key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);
    tokenPayload = jwt.verify(prevRefreshToken, key) as {
      id: string;
      role: string;
    };
  } catch (err) {
    // console.error(error);
    // console.log('INVALID_OR_EXPIRED_REFRESH_TOKEN');
    // isValid = false;

    // return res.send({
    //   isValid,
    //   accessToken,
    //   refreshToken,
    // });
    throw new Error('INVALID_OR_EXPIRED_REFRESH_TOKEN');
  }

  const { id, role } = tokenPayload;
  plannerId = id.split(':')[1];

  const newTokenPayload = {
    id,
    role,
  };

  const { accessToken, refreshToken } = await generateToken(newTokenPayload);

  try {
    // FIXME: refreshToken db에 저장하는 이유??
    // FIXME: 사용가능한 토큰의 중복 제거를 위한 거라면 추가 로직 넣기(DB refresh Token과 대조해여 최신 refresh token일 경우만 사용 가능하게 하는 로직)
    await userRepository.update(id, {
      refreshToken,
      lastLoggedIn: 'NOW()',
    });

    // FIXME: login history 저장 시 appId 저장하는 이유?
    await plannerLoginHistoryRepository.save({
      plannerId,
      appId,
    });
  } catch (err) {
    console.error(err);
    console.log(
      'UNABLE_TO_SAVE_USER_DATA_OR_LOGIN_HISTORY',
      'plannerId:',
      plannerId
    );
    // TODO: 밑에 처럼 throw 하게되면 추가 처리 로직이 필요함..에러메시지가 묻힌다.
    // throw new Error('UNABLE_TO_SAVE_USER_DATA_OR_LOGIN_HISTORY');
  } finally {
    return res.send({
      sucess: true,
      data: { accessToken, refreshToken },
    });
  }
};

// // TODO: 안쓰고있는 func
// @Mutation(returns => SignInPayload)
// public async getToken(
//   @Arg('plannerId') plannerId: string
// ): Promise<SignInPayload> {
//   const provider = Provider.APLUS_ASSET;
//   const providerUserId = plannerId;
//   const userId = `${provider}:${providerUserId}`;

//   const userObj = this.userRepository.create({
//     userId,
//     provider,
//     providerUserId,
//     role: UserRole.PLANNER
//   });
//   const user = await this.userRepository.save(userObj);

//   const tokenPayload = {
//     id: user.userId,
//     role: user.role
//   };

//   const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

//   const accessToken = sign(tokenPayload, key, { expiresIn: '24h' });
//   const refreshToken = sign(tokenPayload, key, { expiresIn: '12h' });

//   return {
//     accessToken,
//     refreshToken
//   };
// }

// // TODO: 안쓰고있는 func
// @Mutation(returns => SignInPayload)
// public async signInByKakao(@Args() args: SignInByKakaoArgs): Promise<SignInPayload> {
//   const { provider, providerUserId } = await service.signInByKakao({
//     accessToken: args.accessToken
//   });

//   const user = this.userRepository.create({
//     userId: `${provider}:${providerUserId}`,
//     provider,
//     providerUserId,
//     role: UserRole.CUSTOMER
//   });

//   await this.userRepository.save(user);

//   const tokenPayload = {
//     id: user.userId,
//     role: user.role
//   };

//   const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

//   const accessToken = sign(tokenPayload, key, { expiresIn: '30m' });
//   const refreshToken = sign(tokenPayload, key, { expiresIn: '12h' });

//   await this.userRepository.save({
//     userId: user.userId,
//     refreshToken
//   });

//   return {
//     accessToken,
//     refreshToken
//   };
// }

// // TODO: 안쓰고있는 func
// @Mutation(returns => SignInPayload)
// public async createManagerToken(
//   @Arg('tfaId') tfaId: string
// ): Promise<SignInPayload> {
//   const provider = Provider.APLUS_ASSET;
//   const providerUserId = tfaId;
//   const user = this.userRepository.create({
//     userId: `${provider}:${providerUserId}`,
//     provider,
//     providerUserId,
//     role: UserRole.MANAGER
//   });

//   await this.userRepository.save(user);

//   const tokenPayload = {
//     id: user.userId,
//     role: user.role
//   };

//   const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

//   const accessToken = sign(tokenPayload, key, { expiresIn: '10000d' });
//   const refreshToken = sign(tokenPayload, key, { expiresIn: '12h' });

//   await this.userRepository.save({
//     userId: user.userId,
//     refreshToken
//   });

//   return {
//     accessToken,
//     refreshToken
//   };
// }
