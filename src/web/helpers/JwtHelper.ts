import jwt from "jsonwebtoken";
import moment from "moment";
import { AuthToken } from "../models/AuthToken";

const TokenExpiresIn = 2592000; // Seconds in 1 month
const JwtSignSecretKey = process.env.JWT_TOKEN_SECRET;

export class JwtHelper {
  static getToken(payload: any): AuthToken {
    const expiresIn = moment()
      .add(TokenExpiresIn, "seconds")
      .unix();
    const token = jwt.sign(payload, JwtSignSecretKey, { expiresIn: TokenExpiresIn });

    return new AuthToken(token, expiresIn);
  }
}
