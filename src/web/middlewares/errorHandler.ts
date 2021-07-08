import { NextFunction, Request, Response } from "express";
import {
  BaseResponseModel,
  ErrorResponseModel
} from "../models/responses/BaseResponseModel";
import { ValidationException } from "../../core/exceptions/ValidationException";

function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = 500;
  const message = error.message || "Something went wrong";
  let errorCode = "SERVER_ERROR";

  if (error instanceof ValidationException) {
    errorCode = "MISSING_PARAMETER";
  }

  response
    .status(status)
    .send(
      new BaseResponseModel(
        BaseResponseModel.Status.Error,
        new ErrorResponseModel(errorCode, message)
      )
    );
}

export default errorHandler;
