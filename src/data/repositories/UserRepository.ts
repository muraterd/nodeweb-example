import { injectable } from "inversify";
import { UserDocument, IUserDocument } from "../schemas/user.schema";
import { IUserModel } from "../entities/IUserModel";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class UserRepository extends BaseRepository<IUserDocument, IUserModel> {
  constructor() {
    super(UserDocument);
  }

  findByEmail = async (email: string) => {
    return UserDocument.findOne({ email });
  };

  findByPhone = async (phone: string) => {
    return UserDocument.findOne({ phone });
  };

  findTest = async (id: string, fields?: string) => {
    return UserDocument.findOne({ _id: id }).select("-__v -createdAt");
  };
}
