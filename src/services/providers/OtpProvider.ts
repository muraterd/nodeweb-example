import { injectable } from "inversify";
import { Helpers } from "../../core/Helpers";

@injectable()
export class OtpProvider {
  createOtp(): string {
    if (process.env.DEV === "true") {
      return "0000";
    }

    return Helpers.getRandomCode({
      length: 4,
      useNumbers: true,
      useAlphanumeric: false,
      userSpecialChars: false
    });
  }
}
