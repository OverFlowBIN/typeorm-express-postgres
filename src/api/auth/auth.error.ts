import { BaseError } from '../../interfaces/error';

export class AccessDeniedError extends BaseError {
  constructor() {
    super(0, "Access denied! You don't have permission for this action!");
  }
}

export class InvalidAccessTokenError extends BaseError {
  constructor() {
    super(0, 'Invalid access token');
  }
}

export class InvalidUserAccountError extends BaseError {
  constructor() {
    super(0, 'Invalid user account');
  }
}

export class CantFindAplusPlannerError extends BaseError {
  constructor() {
    super(0, "Can't find planner info");
  }
}

export class InvalidPhoneError extends BaseError {
  constructor() {
    super(0, 'user have no phone');
  }
}

export class AplusServerError extends BaseError {
  constructor() {
    super(0, "Can't Connect to Aplus");
  }
}

export class InvalidAppTokenError extends BaseError {
  constructor() {
    super(0, 'Invalid App Token');
  }
}
export class InvalidAuthKeyError extends BaseError {
  constructor() {
    super(0, 'Invalid Auth Key');
  }
}
export class WrongProviderError extends BaseError {
  constructor() {
    super(0, 'Wrong Provider');
  }
}
export class TokenExpiredError extends BaseError {
  constructor() {
    super(0, 'Token Expired');
  }
}
