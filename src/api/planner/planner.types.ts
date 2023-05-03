import { HistoryArgs, PaginationArgs } from '../common/common.types';
import { Company } from '../../interfaces/enums';
import { Request } from 'express';
import { IsString, IsInt, IsDefined, IsEmail } from 'class-validator';

// TODO: 추가하기
export class GetPlannersArgs extends PaginationArgs {
  public name: string;
}
export class GetHistoryArgs extends HistoryArgs {}

export class CreatePlannerInput {
  public plannerId: string;
  public name: string;
  public phone: string;
  public company: Company;
  public headquarter?: string;
  public branch?: string;
  public position?: string;
}

export class CreatePlannerLoginHistoryInput {
  public plannerId: string;
  public appId: string;
}

// class-validator를 활용한 input data validation 진행
export class CreatePlannerReferralHistoryInput {
  @IsDefined()
  @IsInt()
  public plannerId: string;

  @IsDefined()
  @IsString()
  public appId: string;

  @IsDefined()
  @IsString()
  public phone: string;

  @IsDefined()
  @IsEmail()
  public email: string;
}

export class UpdateCompanyPlannersInput {
  public company: Company;
}

// ========================== add type V2 ==========================

export interface PannerInfoReq extends Request {
  userId: string;
  userRole: string;
}
