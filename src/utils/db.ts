import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { RequestStatus } from '../interfaces/enums';

export const validationObject = (object: object) => {
  Object.keys(object).forEach(
    (key) => object[key] === undefined && delete object[key]
  );

  return object;
};

export const validationBetween = <T>(
  from?: T | FindOperator<T>,
  to?: T | FindOperator<T>
): FindOperator<any> => {
  if (from && to) {
    return Between<T>(from, to);
  } else if (from) {
    return MoreThanOrEqual(from);
  } else if (to) {
    return LessThanOrEqual(to);
  }

  return undefined;
};

export const validateStatusTransition = (
  current: RequestStatus,
  next: RequestStatus
) => {
  if (current === RequestStatus.UNASSIGNED) {
    if (next === RequestStatus.ASSIGNED) {
      return true;
    }
  } else if (current === RequestStatus.ASSIGNED) {
    if (next === RequestStatus.ACCEPTED || next === RequestStatus.ASSIGNED) {
      return true;
    }
  } else if (current === RequestStatus.ACCEPTED) {
    if (next === RequestStatus.ASSIGNED) {
      return true;
    }
  }
  return false;
};
