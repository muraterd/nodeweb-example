import { BaseResponseModel } from "./BaseResponseModel";

export class BadRequestResponse extends BaseResponseModel {
  constructor(code: string, message: string, details?: any) {
    super(BaseResponseModel.Status.Error, {
      code,
      message,
      details
    });
  }
}
