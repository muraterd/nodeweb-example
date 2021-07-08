import { Request, Response, NextFunction } from "express-serve-static-core";
import { ValidationErrorResponse } from "../../../models/responses/ValidationErrorResponse";
import { LoginWithOtpCommand } from "../../../services/auth/commands/LoginWithOtpCommand";

export class LoginWithOtpRequest {
  phone: string;
  otp: string;

  static validate = (req: Request, res: Response, next: NextFunction) => {
    req
      .check("phone")
      .trim()
      .notEmpty()
      .withMessage("Telefon numarası boş olmamalı")
      .isMobilePhone("tr-TR")
      .withMessage("Lütfen geçerli bir telefon girin.");

    req
      .check("otp")
      .trim()
      .notEmpty()
      .withMessage("Kod boş olmamalı")
      .isLength({ min: 4 })
      .withMessage("Hatalı bir kod girdiniz.");

    const errors = req.validationErrors();
    if (errors) {
      return res.status(422).send(new ValidationErrorResponse("", errors));
    } else {
      next();
    }
  };
}
