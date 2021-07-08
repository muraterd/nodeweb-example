import { injectable } from "inversify";
import { OtpDocument, IOtpDocument } from "../schemas/otp.schema";
import { IOtpModel } from "../entities/IOtpModel";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class OtpRepository extends BaseRepository<IOtpDocument, IOtpModel> {
  constructor() {
    super(OtpDocument);
  }

  findByPhone = async (phone: string, otp: string) => {
    return OtpDocument.findOne({ phone, otp });
  };
}
