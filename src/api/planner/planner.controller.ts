import { AppDataSource } from '../../database/bople';
import { NextFunction, Request, Response } from 'express';
import { Like, In } from 'typeorm';
import { validationObject, validationBetween } from '../../utils/db';

/* import type */
import {
  GetHistoryArgs,
  CreatePlannerInput,
  CreatePlannerLoginHistoryInput,
  CreatePlannerReferralHistoryInput,
  UpdateCompanyPlannersInput,
  PannerInfoReq,
} from './planner.types';
import { Company } from '../../interfaces/enums';

/* import service & util */
import { getPlannersInfo } from './planner.service';
import { markPhoneNum } from './planner.util';

/* import 3rd-party */
import jwt from 'jsonwebtoken';
import * as kms from '../../utils/kms';

/* connect repository */
import {
  Planner,
  PlannerLoginHistory,
  PlannerReferralHistory,
} from '../../entities';
const plannerRepository = AppDataSource.getRepository(Planner);
const plannerLoginHistoryRepository =
  AppDataSource.getRepository(PlannerLoginHistory);
const referralRepository = AppDataSource.getRepository(PlannerReferralHistory);

// ================================ PLANNER SERVICE ================================

/**
 * 로그인 후 설계사가 자기 정보를 조회한다.(토큰정보 이용)
 */
export const plannerOwn = async (
  req: PannerInfoReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const plannerId = userId.split(':')[1];

  try {
    const result = await plannerRepository.findOneOrFail({
      where: { plannerId },
    });
    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    throw new Error('CANT_FIND_PLANNER_BY_PLANNER_ID');
  }
};

/**
 * 설계사 ID를 이용해 설계사 정보를 조회
 */
export const plannerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { plannerId } = req.params;

  try {
    const result = await plannerRepository.findOneOrFail({
      where: { plannerId },
    });
    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    // ERROR: 삭제 가능 Error ?
    console.error(err);
    throw new Error('CANT_FIND_PLANNER_BY_PLANNER_ID');
  }
};

/**
 * 고객이 상담요청을 위한 설계사 목록을 조회
 */
export const plannersByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.params;

  try {
    const planners = await plannerRepository.find({
      where: {
        name: Like(`%${name}%`),
        position: In(['T', 'E']),
      },
      select: ['plannerId', 'name', 'headquarter', 'branch', 'phone'],
    });

    const result = planners.map((planner) => {
      if (!planner.phone) {
        return planner;
      } else {
        planner.phone = markPhoneNum(planner.phone);
        return planner;
      }
    });
    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    // ERROR: 삭제 가능 Error
    console.error(err);
    throw new Error('CANT_FIND_PLANNER_BY_PLANNER_NAME');
  }
};

/**
 * 추천한 설계사 검색 ???? (정확히 확인 안됨)
 */
// TODO: plannerByInvitation 무슨 기능인지 확인 안됨
export async function plannerByInvitation(req: PannerInfoReq, res: Response) {
  const userId = req.userId;
  const plannerId = userId.split(':')[1];

  try {
    const planner = await plannerRepository.findOneOrFail({
      where: {
        plannerId: plannerId,
      },
      select: ['plannerId', 'name', 'headquarter', 'branch', 'phone'],
    });

    if (!planner.phone) {
      return res.send({
        sucess: true,
        data: planner,
      });
    } else {
      planner.phone = markPhoneNum(planner.phone);
      return res.send({
        sucess: true,
        data: planner,
      });
    }
  } catch (err) {
    // ERROR: 삭제 가능 Error
    console.error(err);
    throw new Error('CANT_FIND_PLANNER_BY_PLANNER_ID');
  }
}

/**
 * 설계사의 로그인 이력을 확인
 */
export async function loginHistory(req: PannerInfoReq, res: Response) {
  // TODO: qeury 처리 바꿀 순 없나?
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  const userId = req.userId;
  const plannerId = userId.split(':')[1];

  try {
    const result = await plannerLoginHistoryRepository.find({
      where: validationObject({
        plannerId: plannerId,
        createdAt: validationBetween<Date>(
          new Date(startDate),
          new Date(endDate)
        ),
      }),
      select: ['appId', 'createdAt'],
      skip: parseInt(offset),
      take: parseInt(limit),
      order: {
        createdAt: 'ASC',
      },
    });
    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    throw new Error('CANT_FIND_PLANNER_LOGIN_HISTORY');
  }
}

/**
 * 설계사의 추천인 이력을 확인
 */
export async function referralHistory(req: PannerInfoReq, res: Response) {
  // TODO: qeury 처리 바꿀 순 없나?
  const offset = req.query.offset as string;
  const limit = req.query.limit as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  const userId = req.userId;
  const plannerId = userId.split(':')[1];

  try {
    // TODO: 현재 해당 DB를 사용하고 있지 않다.
    const result = await referralRepository.find({
      where: validationObject({
        plannerId,
        createdAt: validationBetween<Date>(
          new Date(startDate),
          new Date(endDate)
        ),
      }),
      select: ['appId', 'phone', 'email', 'createdAt'],
      skip: parseInt(offset),
      take: parseInt(limit),
      order: {
        createdAt: 'ASC',
      },
    });
    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    // TODO: Error handler
    throw new Error('---');
  }
}

/**
 * 설계사 추천 시 추천인 이력을 추가
 */

// FIXME: 해당 API 사용 이유 및 이후 사용 여부 확인한 후 작성하기
// TODO: 추천시 planner_referral_history table의 phone, appId가 Unique값임... 한사람은 한명만 추천 가능인데.. 문제될게없나 로직검토 해보기
export async function createPlannerReferralHistory(
  req: Request,
  res: Response
) {
  const { plannerId, appId, phone, email }: CreatePlannerReferralHistoryInput =
    req.body;

  try {
    const planner = await plannerRepository.findOne({ where: { plannerId } });

    const history = referralRepository.create({
      planner,
      appId,
      phone,
      email,
    });

    const result = await referralRepository.save(history);

    return res.send({
      sucess: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    throw new Error('CANT_CREATE_PLANNER_REFERRAL_HISTORY');
  }
}

/**
 * 에이플러스 설계사 목록을 업데이트
 */
export async function updateCompanyPlanners(req: Request, res: Response) {
  try {
    const boplePlanners = await plannerRepository.find({
      select: ['plannerId', 'name', 'phone'],
    });

    const aplusPlanners = await getPlannersInfo(Company.APLUS_ASSET);

    const arrToUpdate = [];
    const arrToInsert = [];

    aplusPlanners.forEach((doc: any) => {
      const { plannerId, name, phone, active } = doc;

      const index = boplePlanners.findIndex(
        (planner: any) =>
          planner.plannerId === plannerId ||
          (planner.phone !== null &&
            planner.name === name &&
            planner.phone === phone)
      );

      if (index === -1) {
        arrToInsert.push(doc);
      } else {
        if (active === 'N') {
          arrToUpdate.push({ ...doc, phone: null });
        } else {
          arrToUpdate.push(doc);
        }
      }
    });

    const updateArr: any = arrToUpdate.map(({ company, ...info }) =>
      plannerRepository.create(info)
    );
    const insertArr: any = arrToInsert.map((doc) =>
      plannerRepository.create(doc)
    );

    await Promise.all(
      updateArr.map((doc: any) => plannerRepository.update(doc.plannerId, doc))
    );
    await plannerRepository.save(insertArr);

    return res.send({ success: true });
  } catch (err) {
    console.error(err);
    throw new Error('CANT_UPDATE_PLANNER_LIST');
  }
}
