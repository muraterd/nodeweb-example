import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { BaseMiddleware } from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { UserRepository } from "../../data/repositories/UserRepository";
import { TYPES } from "../di/Types";

const JwtSignSecretKey = process.env.JWT_TOKEN_SECRET;

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.IUserRepository) private readonly userRepository: UserRepository;
  public async handler(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      res.status(401).send({ error: "Token is missing" });
      return;
    }

    const token = bearerToken.replace("Bearer ", "");

    try {
      const payload: any = jwt.verify(token, JwtSignSecretKey);
      const user = await this.userRepository.findById(payload.id);

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).send({});
      }
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }
}
