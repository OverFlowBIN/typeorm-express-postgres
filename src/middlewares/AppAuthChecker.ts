import jwt from 'jsonwebtoken';
import * as kms from '../utils/kms';
import { Request, Response, NextFunction } from 'express';

interface PannerInfoReq extends Request {
  userId: string;
  userRole: string;
}

// interface Claims {
//   id: string;
//   role: string;
//   iat: number;
//   exp: number;
// }

/**
 * App에 접근하는 모든 유저에 대한 토큰 검사
 */
const AppAuthChecker = async (
  req: PannerInfoReq,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  const key = await kms.decrypt(process.env.CONCAT_TOKEN_KEY);

  if (!token) {
    throw new Error('NONE_TOKEN_ERROR');
  } else {
    let claims: any;

    try {
      claims = jwt.verify(token, key);
      /*
        claims: {
            id: 'APLUS_ASSET:99999021';
            role: 'PLANNER';
            iat: 1682670462;
            exp: 1682681262;
        };
      */
      req.userId = claims.id; // TODO: 아직 쓰는데는 없음
      req.userRole = claims.role;
    } catch (err) {
      throw new Error('INVALID_APP_TOKEN_ERROR');
    }

    if (!claims || !(claims instanceof Object)) {
      throw new Error('INVALID_APP_TOKEN_ERROR');
    }

    // TODO: 용도 ?
    if (!('iat' in claims)) {
      throw new Error('INVALID_APP_TOKEN_ERROR');
    }
  }

  return next();
};

export default AppAuthChecker;
