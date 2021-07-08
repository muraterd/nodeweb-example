import "reflect-metadata";
import express from "express";
import session from "express-session";
import chalk from "chalk";
import passport from "passport";
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Container } from "inversify";
import { interfaces, InversifyExpressServer, TYPE } from "inversify-express-utils";
import errorHandler from "./middlewares/errorHandler";
import https from "https";
import fs from "fs";

dotenv.config();

const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRYIO_DSN
});

import "./configs";

mongoose
  .connect("mongodb://localhost:27017/NodeWeb", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Veritabanına bağlanıldı");
  })
  .catch(error => {
    console.log("Veritabanına bağlanılamadı");
  });

// declare metadata by @controller annotation
import "./controllers/auth/AuthController";
import "./controllers/HomeController";
import "./controllers/users/UsersController";
import { AuthService } from "../services/auth/AuthService";
import { IAuthService } from "./services/auth/IAuthService";
import { UserRepository } from "../data/repositories/UserRepository";
import { BaseException } from "../core/exceptions/BaseException";
import { OtpProvider } from "../services/providers/OtpProvider";
import { OtpRepository } from "../data/repositories/OtpRepository";
import { AuthMiddleware } from "./middlewares/auth";
import { TYPES } from "./di/Types";

// set up container
let container = new Container();

// set up bindings
container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<UserRepository>(TYPES.IUserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<OtpRepository>(TYPES.IOtpRepository)
  .to(OtpRepository)
  .inSingletonScope();
container.bind<OtpProvider>(TYPES.IOtpProvider).to(OtpProvider);
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

// create server
let server = new InversifyExpressServer(container);
server
  .setConfig(app => {
    // Sentry.io request handler. The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    app.use(express.static("public"));

    // add body parser
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(expressValidator());
  })
  .setErrorConfig(app => {
    // Handle 404
    app.use((req, res) => {
      res.status(404).send({ data: "Not Found" });
    });

    // Sentry.io error handler. This error handler must be before any other error middleware
    app.use(Sentry.Handlers.errorHandler());

    // Global error handler
    app.use(errorHandler);
  });

let app = server.build();

// https
//   .createServer(
//     {
//       key: fs.readFileSync("localhost.key"),
//       cert: fs.readFileSync("localhost.crt")
//     },
//     app
//   )
//   .listen(3000, function() {
//     console.log("Example app listening on port 3000! Go to https://localhost:3000/");
//   });

app.listen(3000, () => {
  console.log("Server started. Listening on port 3000");
});
