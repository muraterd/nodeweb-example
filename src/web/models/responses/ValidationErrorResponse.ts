import { BaseResponseModel } from "./BaseResponseModel";

export class ValidationErrorResponse extends BaseResponseModel {
  constructor(message: string, details: any) {
    super(BaseResponseModel.Status.Error, {
      code: "VALIDATION_ERROR",
      message,
      details
    });
  }
}
