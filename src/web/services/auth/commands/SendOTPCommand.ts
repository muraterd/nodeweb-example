import validator from "validator";
import { ValidationException } from "../../../../core/exceptions/ValidationException";

export class SendOTPCommand {
  constructor(public phone: string, public ip?: string) {}

  validate(): boolean {
    if (!this.phone) {
      throw new ValidationException("phone", "telefon numarası boş olmamalı");
    }

    return true;
  }
}
