import { Request, Response, NextFunction } from "express-serve-static-core";
import { ValidationErrorResponse } from "../../../models/responses/ValidationErrorResponse";

export class SendOtpRequest {
  phone: string;

  static validate = (req: Request, res: Response, next: NextFunction) => {
    req
      .check("phone")
      .trim()
      .notEmpty()
      .withMessage("Telefon boş olmamalı")
      .isMobilePhone("tr-TR")
      .withMessage("Lütfen geçerli bir telefon girin.");

    const errors = req.validationErrors();
    if (errors) {
      return res.status(422).send(new ValidationErrorResponse("", errors));
    } else {
      next();
    }
  };
}
