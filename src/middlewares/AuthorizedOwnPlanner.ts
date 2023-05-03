import jwt from 'jsonwebtoken';
import * as kms from '../utils/kms';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/enums';

interface UserRoleReq extends Request {
  userRole: string;
}

/**
 * 설계사 API 접근 권한 제한
 */
const AuthorizedOwnPlanner = async (
  req: UserRoleReq,
  res: Response,
  next: NextFunction
) => {
  // 1. AppAuthChecker로 받은 userRole 받는다
  const role = req.userRole;

  // 2. 받은 userRole을 이용하여 access / denied 검토
  // 2-1. denied 일 경우 에러 전달
  if (!role || role !== UserRole.PLANNER) {
    throw new Error('ACCESS_DENIED_ERROR');
  }

  // 2-2. access 일 경우 next() 함수 실행
  return next();
};

export default AuthorizedOwnPlanner;
