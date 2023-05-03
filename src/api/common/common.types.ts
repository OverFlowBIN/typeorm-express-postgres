export class PaginationArgs {
  public offset?: number = 0;

  public limit?: number = 10;
}

export class HistoryArgs extends PaginationArgs {
  public startDate: Date;

  public endDate: Date;
}

export class Result {
  public success: boolean;

  public data?: string;

  public errorCode?: string;

  public errorMsg?: string;
}

export class Organization {
  public org: string;
}

export class RecommendInsuranceResult {
  public result: string;
}

export class RecommendInsuranceArgs {
  public birth: string;

  public sex: string;

  public type: string;
}
