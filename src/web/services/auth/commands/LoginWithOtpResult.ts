import { IUserDocument } from "../../../../data/schemas/user.schema";

export class LoginWithOtpResult {
  status: LoginWithOtpResult.Status;
  user?: IUserDocument;
}

export namespace LoginWithOtpResult {
  export enum Status {
    Success,
    User_Not_Found,
    Wrong_Otp,
    User_Not_Activated,
    User_Banned,
    Code_Expired
  }
}
