import { BaseHttpController } from "inversify-express-utils";
import { ValidationErrorResponse } from "../models/responses/ValidationErrorResponse";
import { BadRequestResponse } from "../models/responses/BadRequest";
import { IUserModel } from "../../data/entities/IUserModel";

export class BaseController extends BaseHttpController {
  // protected currentUser = this.httpContext.request.user;
  get currentUser(): IUserModel {
    return this.httpContext.request.user;
  }

  ValidationError = (message?: string, details?: any) => {
    this.httpContext.response.status(422).send(new ValidationErrorResponse(message, details));
  };

  BadRequest = (code: string, message: string, details?: any) => {
    this.httpContext.response.status(400).send(new BadRequestResponse(code, message, details));
  };
}
