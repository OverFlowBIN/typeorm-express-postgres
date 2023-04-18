// import { //registerEnumType } from 'type-graphql';

export enum Company {
  APLUS_ASSET = 'APLUS_ASSET',
}
// registerEnumType(Company, {
//   name: 'Company'
// });

export enum Provider {
  KAKAO = 'KAKAO',
  APLUS_ASSET = 'APLUS_ASSET',
  KCREDIT = 'KCREDIT',
}
// registerEnumType(Provider, {
//   name: 'Provider'
// });

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PLANNER = 'PLANNER',
  MANAGER = 'MANAGER',
}
// registerEnumType(UserRole, {
//   name: 'UserRole'
// });

/**
 * REQUEST
 */
export enum RequestStatus {
  UNASSIGNED = 'UNASSIGNED',
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  WITHDRAWN = 'WITHDRAWN',
}
// registerEnumType(RequestStatus, {
//   name: 'RequestStatus'
// });

export enum RequestMeetingTime {
  ANYTIME = 'ANYTIME',
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}
// registerEnumType(RequestMeetingTime, {
//   name: 'RequestMeetingTime'
// });

export enum RequestPurpose {
  PREMIUM = 'PREMIUM',
  GUARANTEE = 'GUARANTEE',
  CLAIM = 'CLAIM',
  NEW = 'NEW',
}
// registerEnumType(RequestPurpose, {
//   name: 'RequestPurpose'
// });

export enum SecureNumberRefreshEnum {
  NO_REFRESH = '0',
  REFRESH = '1',
  CANCEL = '2',
}
// registerEnumType(SecureNumberRefreshEnum, {
//   name: 'SecureNumberRefreshEnum'
// });

export enum InquiryTypeEnum {
  HP = '0',
  CARD = '1',
}
// registerEnumType(InquiryTypeEnum, {
//   name: 'InquiryTypeEnum'
// });

export enum TelecomEnum {
  SKT = '0',
  KT = '1',
  LG = '2',
  SKT_MVNO = '3',
  KT_MVNO = '4',
  LG_MVNO = '5',
}
// registerEnumType(TelecomEnum, {
//   name: 'TelecomEnum'
// });

export enum CheckInquiryTypeEnum {
  REGISTRATION = '0',
  ID = '2',
  EMAIL = '3',
  INFO = '4',
}
// registerEnumType(CheckInquiryTypeEnum, {
//   name: 'CheckInquiryTypeEnum'
// });

export enum SexEnum {
  MALE = '0',
  FEMALE = '1',
}
// registerEnumType(SexEnum, {
//   name: 'SexEnum'
// });
