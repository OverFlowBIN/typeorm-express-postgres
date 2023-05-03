export class SignInByKCreditArgs {
  public userId: string;
  public authKey: string;
}

export class SignInByKakaoArgs {
  public accessToken: string;
}

export class SignInByAplusArgs {
  public plannerId: string;
  public password: string;
  public phone: string;
  public appId: string;
}

export class RefreshAccessTokenArgs {
  public prevRefreshToken: string;
  public appId: string;
}

export class AuthRequestArgs {
  public userId: string;
  public phone: string;
}

export class VerifyAuthNumberArgs {
  public userId: string;
  public phone: string;
  public authKey: string;
}

export class SignInPayload {
  public accessToken: string;
  public refreshToken: string;
}

export class RefreshAccessTokenPayload {
  public isValid: boolean;
  public accessToken?: string;
  public refreshToken?: string;
}

// ========================== add type V2 ==========================

export interface CertificationInfoByPortOne {
  certificationsInfo: {
    birth: number;
    birthday: string;
    certified: boolean;
    certified_at: number;
    foreigner: boolean;
    foreigner_v2: null;
    gender: null;
    imp_uid: string;
    merchant_uid: string;
    name: string;
    origin: string;
    pg_provider: string;
    pg_tid: string;
    phone: string;
    unique_in_site: null;
    unique_key: string;
  };
}

export interface UpdateCustomerInfoInput {
  tfaId: string;
  name: string;
  birth: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  address_detail?: string;
}
