import { LoginCommand } from "./commands/LoginCommand";
import { LoginResult } from "./commands/LoginResult";
import { SendOTPCommand } from "./commands/SendOTPCommand";
import { SendOTPResult } from "./commands/SendOTPResult";
import { LoginWithOtpCommand } from "./commands/LoginWithOtpCommand";
import { LoginWithOtpResult } from "./commands/LoginWithOtpResult";

export interface IAuthService {
  login(command: LoginCommand): LoginResult;

  sendOTP(command: SendOTPCommand): Promise<SendOTPResult>;

  loginWithOtp(command: LoginWithOtpCommand): Promise<LoginWithOtpResult>;
}
