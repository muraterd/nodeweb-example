import { Request, Response, NextFunction } from "express-serve-static-core";
import { ValidationErrorResponse } from "../../../models/responses/ValidationErrorResponse";

export class LoginRequest {
  email: string;
  password: string;

  static validate = (req: Request, res: Response, next: NextFunction) => {
    req
      .check("email")
      .trim()
      .notEmpty()
      .withMessage("Email boş olmamalı")
      .isEmail()
      .withMessage("Lütfen geçerli bir email girin.");

    req
      .check("password")
      .notEmpty()
      .withMessage("Şifre boş olmamalı")
      .isLength({ min: 3 })
      .withMessage("Şifre 3 karakterden az olmamalı");

    const errors = req.validationErrors();
    if (errors) {
      return res.status(422).send(new ValidationErrorResponse("", errors));
    } else {
      next();
    }
  };
}
