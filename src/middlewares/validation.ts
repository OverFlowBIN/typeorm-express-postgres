// TODO: validation 방식 체택해서 추가해 주기
import { Request, Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

const validateBody = (schema: { new (): any }) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const target = plainToClass(schema, req.body);
    try {
      await validateOrReject(target);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateBody;
