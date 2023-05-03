import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';

function errorCaseScreener(err: Error) {
  let statusCode: number = 400;
  let errorMessage: string;
  let errorCode: number | null = null;
  const success: boolean = false;

  console.log('================ err ==============', err);
  if (!err.message) {
    /* Validation Error */
    errorMessage = Object.values(err[0].constraints)[0] as string;
    errorCode = 30000;
  } else {
    /* Service Error */
    switch (err.message) {
      /* ================ 1. AUTH ERROR ================= */

      case 'INVALID_USER_ACCOUNT_ERROR':
        errorMessage = 'Invalid user account';
        errorCode = 10101;
        break;
      case 'CANT_FIND_APLUS_PLANNER_ERROR':
        errorMessage = "Can't find planner info";
        errorCode = 10102;
        break;
      case 'INVALID_USER_INFO_BY_PORTONE':
        errorMessage = 'Invalid user info by PortOne';
        errorCode = 10103;
        break;
      case 'NOT_REGISTERD_MEMBER_AT_BOPLE':
        errorMessage = 'You are not a registered member at Bople';
        errorCode = 10104;
        break;
      case 'NONE_TOKEN_ERROR':
        errorMessage = 'Access denied! You have to send access token';
        errorCode = 10105;
        break;
      case 'ACCESS_DENIED_ERROR':
        errorMessage =
          "Access denied! You don't have permission for this action!";
        errorCode = 10106;
        break;
      case 'INVALID_APP_TOKEN_ERROR':
        errorMessage = 'Invalid App Token';
        errorCode = 10107;
        break;
      case 'CANT_FIND_PLANNER_LOGIN_HISTORY':
        errorMessage = "can't find planner login history";
        errorCode = 10108;
        break;

      /* ================ 5. PLANNER ERROR ================= */

      case 'CANT_FIND_PLANNER_BY_PLANNER_ID':
        errorMessage = "Can't find planner by plannerId";
        errorCode = 20501;
        break;
      case 'CANT_FIND_PLANNER_BY_PLANNER_NAME':
        errorMessage = "Can't find planner by planner name";
        errorCode = 20502;
        break;

      case 'CANT_CREATE_PLANNER_LOGIN_HISTORY':
        errorMessage = "Can't create new planner login history";
        errorCode = 20510;
        break;

      case 'CANT_CREATE_PLANNER_REFERRAL_HISTORY':
        errorMessage = "Can't create new planner referral history";
        errorCode = 20511;
        break;

      case 'CANT_UPDATE_PLANNER_LIST':
        errorMessage = "Can't update total planner list to bople";
        errorCode = 20512;
        break;

      /* ================ 6. REQUEST ERROR ================= */

      case 'APLUS_INVALID_RETURN_ERROR':
        errorMessage = 'Aplus invalid return Error';
        errorCode = 20601;
        break;

      /* ====================== 작업 중 ======================= */

      case 'ERROR_TEST':
        errorMessage = 'Error test!';
        errorCode = 10102;
        break;

      // case 'ACCESS_DENIED':
      //   errorMessage =
      //     "Access denied! You don't have permission for this action!";
      //   errorCode = 10101;
      //   break;
      // case 'INVALID_ACCESS_TOKEN':
      //   errorMessage = 'Invalid access token';
      //   errorCode = 10102;
      //   break;
      // case 'INVALID_USER_ACCOUNT':
      //   errorMessage = 'Invalid user account';
      //   errorCode = 10103;
      //   break;
      // case 'CANT_FIND_APLUS_PLANNER':
      //   errorMessage = "Can't find planner info";
      //   errorCode = 10104;
      //   break;
      // case 'INVALID_PHONE':
      //   errorMessage = 'user have no phone';
      //   errorCode = 10105;
      //   break;
      // case 'APLUS_SERVER':
      //   errorMessage = "Can't Connect to Aplus";
      //   errorCode = 10106;
      //   break;
      // case 'INVALID_APP_TOKEN':
      //   errorMessage = 'Invalid App Token';
      //   errorCode = 10107;
      //   break;
      // case 'INVALID_AUTH_KEY':
      //   errorMessage = 'Invalid Auth Key';
      //   errorCode = 10108;
      //   break;
      // case 'WRONG_PROVIDER':
      //   errorMessage = 'Wrong Provider';
      //   errorCode = 10109;
      //   break;
      // case 'TOKEN_EXPIRED':
      //   errorMessage = 'Token Expired';
      //   errorCode = 10110;
      //   break;
      default:
        statusCode = 500;
        errorMessage = 'Internal server error. please try again later';
    }
  }

  return { success, errorCode, statusCode, errorMessage };
}

export function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // req.xhr이 false인 경우,
  // 클라이언트 측에서의 Ajax 요청이 아닌 일반적인 HTTP요청이 발생한것으로 간주한다. => 올바른 방식이 아니다.
  if (req.xhr) {
    return res.status(500).send({ error: 'Internal server error' });
  }
  return next(err);
}

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // res.headersSent: HTTP 응답 헤더가 이미 전송되었는지 true, false로 나타냄
  // TODO: 현재 넘길곳이 없음..
  if (res.headersSent) {
    next(err);
  }

  const { success, errorCode, statusCode, errorMessage } =
    errorCaseScreener(err);

  return res.status(statusCode).send(
    errorCode
      ? {
          success,
          errorCode,
          message: `${errorMessage}`,
        }
      : {
          success,
          message: `${errorMessage}`,
        }
  );
}
