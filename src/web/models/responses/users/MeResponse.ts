import { User } from "../../User";
import { IUserDocument } from "../../../../data/schemas/user.schema";

export class MeResponse {
  isRegisterCompleted: boolean;
  user: User;

  static fromUserDocument(user: IUserDocument): MeResponse {
    const response = new MeResponse();
    response.user = User.fromUserDocument(user);
    response.isRegisterCompleted =
      response.user.firstname != null && response.user.lastname != null && response.user.birthdate != null;
    return response;
  }
}
