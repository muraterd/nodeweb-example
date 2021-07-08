import { User } from "../../User";
import { IUserDocument } from "../../../../data/schemas/user.schema";
import { AuthToken } from "../../AuthToken";

export class LoginWithOtpResponse {
  token: string;
  expiresIn?: number;
  isRegisterCompleted: boolean;
  user: User;

  static fromUserDocument(authToken: AuthToken, user: IUserDocument): LoginWithOtpResponse {
    const response = new LoginWithOtpResponse();
    response.token = authToken.token;
    response.expiresIn = authToken.expiresIn;
    response.user = User.fromUserDocument(user);
    response.isRegisterCompleted =
      response.user.firstname != null && response.user.lastname != null && response.user.birthdate != null;
    return response;
  }
}
