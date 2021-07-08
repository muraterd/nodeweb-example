import validator from "validator";
import { ValidationException } from "../../../../core/exceptions/ValidationException";

export class LoginWithOtpCommand {
  constructor(public phone: string, public otp: string) {}

  validate(): boolean {
    if (!this.phone) {
      throw new ValidationException("phone", "telefon numarası boş olmamalı");
    }

    if (!this.otp) {
      throw new ValidationException("otp", "otp boş olmamalı");
    }

    return true;
  }
}
