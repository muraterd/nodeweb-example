import { ValidationException } from "../../../../core/exceptions/ValidationException";

export class LoginCommand {
  constructor(public email: string, public password: string) {}

  validate(): boolean {
    if (!this.email) {
      throw new ValidationException("email", "Email boş olmamalı");
    }

    if (!this.password) {
      throw new ValidationException("password", "Şifre boş olmamalı");
    }

    return true;
  }
}
