export class BaseResponseModel {
  constructor(
    public status: BaseResponseModel.Status,
    public error?: ErrorResponseModel,
    public data?: any
  ) {}
}

export class ErrorResponseModel {
  constructor(
    public code: string,
    public message: string,
    public details?: any
  ) {}
}

export namespace BaseResponseModel {
  export enum Status {
    Success = "success",
    Error = "error"
  }
}
