import { injectable, inject } from "inversify";
import { LoginCommand } from "../../web/services/auth/commands/LoginCommand";
import { LoginResult } from "../../web/services/auth/commands/LoginResult";
import { IAuthService } from "../../web/services/auth/IAuthService";
import { UserRepository } from "../../data/repositories/UserRepository";
import { SendOTPCommand } from "../../web/services/auth/commands/SendOTPCommand";
import { SendOTPResult } from "../../web/services/auth/commands/SendOTPResult";
import moment from "moment";
import { OtpProvider } from "../providers/OtpProvider";
import { LoginWithOtpCommand } from "../../web/services/auth/commands/LoginWithOtpCommand";
import { LoginWithOtpResult } from "../../web/services/auth/commands/LoginWithOtpResult";
import { OtpRepository } from "../../data/repositories/OtpRepository";
import { UserDocument } from "../../data/schemas/user.schema";
import { TYPES } from "../../web/di/Types";

@injectable()
export class AuthService implements IAuthService {
  @inject(TYPES.IOtpProvider) private readonly otpProvider: OtpProvider;
  @inject(TYPES.IUserRepository) private readonly userRepository: UserRepository;
  @inject(TYPES.IOtpRepository) private readonly otpRepository: OtpRepository;

  login(command: LoginCommand): LoginResult {
    if (!command.validate()) {
      return;
    }

    return {
      status: LoginResult.LoginStatus.Success,
      user: { id: "TestId", email: command.email }
    };
  }

  async sendOTP(command: SendOTPCommand): Promise<SendOTPResult> {
    if (!command.validate()) {
      return;
    }

    const code = this.otpProvider.createOtp();
    const now = moment().unix();
    const otpExpireTime = moment()
      .add(1, "hour")
      .unix();

    let otpEntity = await this.otpRepository.create({
      phone: command.phone,
      otp: code,
      expireTime: otpExpireTime,
      createdAt: now,
      ip: command.ip
    });

    return {
      status: SendOTPResult.Status.Success
    };
  }

  async loginWithOtp(command: LoginWithOtpCommand): Promise<LoginWithOtpResult> {
    if (!command.validate()) {
      return;
    }

    const otpEntity = await this.otpRepository.findByPhone(command.phone, command.otp);
    if (!otpEntity) {
      return { status: LoginWithOtpResult.Status.Wrong_Otp };
    }

    const now = moment().unix();
    if (otpEntity.expireTime < now) {
      return { status: LoginWithOtpResult.Status.Code_Expired };
    }

    let user = await this.userRepository.findByPhone(command.phone);

    if (!user) {
      user = await this.userRepository.create({ phone: command.phone });
    }

    this.otpRepository.delete(otpEntity);

    return { status: LoginWithOtpResult.Status.Success, user: user };
  }
}
