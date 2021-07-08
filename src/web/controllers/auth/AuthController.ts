import { inject } from "inversify";
import { controller, httpGet, httpPost, requestBody } from "inversify-express-utils";
import { JwtHelper } from "../../helpers/JwtHelper";
import { LoginCommand } from "../../services/auth/commands/LoginCommand";
import { LoginResult } from "../../services/auth/commands/LoginResult";
import { IAuthService } from "../../services/auth/IAuthService";
import { SendOTPCommand } from "../../services/auth/commands/SendOTPCommand";
import { BaseController } from "../BaseController";
import { SendOtpRequest } from "./requests/SendOtpRequest";
import { LoginRequest } from "./requests/LoginRequest";
import { LoginWithOtpRequest } from "./requests/LoginWithOtpRequest";
import { LoginWithOtpResult } from "../../services/auth/commands/LoginWithOtpResult";
import { LoginWithOtpCommand } from "../../services/auth/commands/LoginWithOtpCommand";
import { Helpers } from "../../../core/Helpers";
import { TYPES } from "../../di/Types";
import { LoginWithOtpResponse } from "../../models/responses/auth/LoginWithOtpResponse";

@controller("/auth")
class AuthController extends BaseController {
  @inject(TYPES.IAuthService) private authService: IAuthService;

  /**
   * Login with email and password
   *
   * @param {LoginRequest} body
   */
  @httpPost("/login", LoginRequest.validate)
  public async login(@requestBody() body: any) {
    const { status, user } = this.authService.login(new LoginCommand(body.email, body.password));

    switch (status) {
      case LoginResult.LoginStatus.Success:
        return this.ok(JwtHelper.getToken({ id: user.id, email: user.email }));
      case LoginResult.LoginStatus.Wrong_Password:
      case LoginResult.LoginStatus.User_Not_Found:
        return this.BadRequest("WRONG_CREDENTIALS", "Kullanıcı adı veya şifre hatalı");
      case LoginResult.LoginStatus.User_Not_Activated:
        return this.BadRequest("ACCOUNT_NOT_ACTIVATED", "Hesap aktive edilmemiş");
    }
  }

  /**
   * Send OTP(One Time Password) with SMS
   *
   * @param {SendOtpRequest} body
   */
  @httpPost("/sendotp", SendOtpRequest.validate)
  public async sendOtp(@requestBody() body: any) {
    const ip = Helpers.getIp(this.httpContext.request);
    const result = await this.authService.sendOTP(new SendOTPCommand(body.phone, ip));

    return this.ok(`Otp sent to: ${body.phone}`);
  }

  /**
   * Login with OTP(One Time Password)
   *
   * @param {LoginWithOtpRequest} body
   */
  @httpPost("/loginwithotp", LoginWithOtpRequest.validate)
  public async loginWithOtp(@requestBody() body: any) {
    const { status, user } = await this.authService.loginWithOtp(new LoginWithOtpCommand(body.phone, body.otp));

    switch (status) {
      case LoginWithOtpResult.Status.Success:
        const authToken = JwtHelper.getToken({ id: user.id, email: user.email });
        return this.ok(LoginWithOtpResponse.fromUserDocument(authToken, user));
      case LoginWithOtpResult.Status.User_Not_Activated:
        return this.BadRequest("ACCOUNT_NOT_ACTIVATED", "Hesap aktive edilmemiş");
      case LoginWithOtpResult.Status.Code_Expired:
        return this.BadRequest("OTP_EXPIRED", "Bu kodun süresi doldu. Lüten yeni bir kod oluşturun.");
      case LoginWithOtpResult.Status.Wrong_Otp:
      case LoginWithOtpResult.Status.User_Not_Found:
      case LoginWithOtpResult.Status.User_Banned:
        return this.BadRequest("WRONG_CREDENTIALS", "Kullanıcı adı veya şifre hatalı");
    }
  }

  @httpGet("/signup")
  public async signup() {
    return this.ok("Signup...");
  }
}
