import {
  controller,
  httpGet,
  httpPost,
  httpPatch,
  requestBody,
  requestParam,
  httpDelete
} from "inversify-express-utils";
import { BaseController } from "../BaseController";
import { inject } from "inversify";
import { UserRepository } from "../../../data/repositories/UserRepository";
import moment from "moment";
import { Upload } from "../../helpers/UploadHelper";
import { TYPES } from "../../di/Types";
import { MeResponse } from "../../models/responses/users/MeResponse";
import { UsersControllerHelper } from "./UsersControllerHelper";
import { Photo } from "../../models/Photo";
import { User } from "../../models/User";
import fs from "fs";
import path from "path";
import { IPhotoModel } from "../../../data/entities/IUserModel";
import uuid from "uuid";

@controller("/users", TYPES.AuthMiddleware)
class UsersController extends BaseController {
  @inject(TYPES.IUserRepository) private readonly userRepository: UserRepository;

  @httpGet("/me")
  public async me() {
    const userDocument = await this.userRepository.findTest(this.currentUser.id);

    const response = MeResponse.fromUserDocument(userDocument);

    return this.ok(response);
  }

  @httpGet("/generate")
  public async generate() {
    const count = 20;

    for (let i = 0; i < count; i++) {
      const testUser = UsersControllerHelper.createRandomUser();
      await this.userRepository.create(testUser);
    }
    return this.ok({ data: `Generated ${count} random user` });
  }

  @httpGet("/")
  public async get() {
    const results = await this.userRepository.find();
    return this.ok({ users: User.fromUserDocumentArray(results) });
  }

  @httpGet("/:id")
  public async getById(@requestParam("id") id: string) {
    const user = this.userRepository.findById(id);
    return this.ok({ user });
  }

  @httpPatch("/:id")
  public async updateUser(@requestParam("id") id: string, @requestBody() body: any) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return this.BadRequest("NOT_FOUND", `There is no user with id ${id}`);
    }

    if (body.birthdate) {
      try {
        user.birthdate = moment(body.birthdate).toDate();
      } finally {
      }
    }

    user.email = body.email || user.email;
    user.firstname = body.firstname || user.firstname;
    user.lastname = body.lastname || user.lastname;
    user.phone = body.phone || user.phone;
    user.sex = body.sex || user.sex;
    user.aboutMe = body.aboutMe || user.aboutMe;
    user.jobTitle = body.jobTitle || user.jobTitle;
    user.company = body.company || user.company;
    user.school = body.school || user.school;

    const updatedUser = await this.userRepository.update(user);

    return this.ok({
      user: User.fromUserDocument(updatedUser)
    });
  }

  @httpPost("/photos", Upload.images.single("photo"))
  public async photos(@requestParam("id") id: string, @requestBody() body: any) {
    const loggedInUser = this.currentUser;
    const user = await this.userRepository.findById(loggedInUser.id);
    const { filename, mimetype, originalname } = this.httpContext.request.file;
    const photoId = uuid();
    user.photos.push({ id: photoId, filename, mimetype, originalname, createdAt: moment().toDate() });

    await this.userRepository.update(user);
    // const filename = this.httpContext.request.file.filename

    return this.ok(new Photo(photoId, filename));
  }

  @httpPost("/:id/photos", Upload.images.single("photo"))
  public async addPhoto(@requestParam("id") id: string, @requestBody() body: any) {
    if (this.currentUser.id != id) {
      return this.statusCode(403);
    }

    let user = await this.userRepository.findById(id);

    if (!user) {
      return this.BadRequest("NOT_FOUND", `There is no user with id ${id}`);
    }

    const { filename, mimetype, originalname } = this.httpContext.request.file;
    const photoId = uuid();
    user.photos.push({ id: photoId, filename, mimetype, originalname, createdAt: moment().toDate() });

    await this.userRepository.update(user);

    return this.ok(new Photo(photoId, filename));
  }

  @httpDelete("/:id/photos/:index", Upload.images.single("photo"))
  public async deletePhoto(
    @requestParam("id") id: string,
    @requestParam("index") index: number,
    @requestBody() body: any
  ) {
    if (this.currentUser.id != id) {
      return this.statusCode(403);
    }

    let user = await this.userRepository.findById(id);

    if (!user) {
      return this.BadRequest("NOT_FOUND", `There is no user with id ${id}`);
    }

    if (index > user.photos.length - 1) {
      return this.BadRequest("BAD_REQUEST", `Index out of bounds`);
    }

    const photo = user.photos[index];

    const uploadsDir = "./public/uploads";
    if (!fs.existsSync(`${uploadsDir}/${photo.filename}`)) {
      return this.BadRequest("FILE_NOT_FOUND", `File not found at ${uploadsDir}/${photo.filename}`);
    }

    fs.unlinkSync(`${uploadsDir}/${photo.filename}`);
    user.photos.splice(index, 1);
    await this.userRepository.update(user);

    return this.ok();
  }

  @httpPatch("/:id/photos/order")
  public async reOrderPhotos(@requestParam("id") id: string, @requestBody() body: any) {
    const newOrderedIds = body.newOrder as any[];

    const user = await this.userRepository.findById(id);
    if (!user) {
      return this.BadRequest("NOT_FOUND", `There is no user with id ${id}`);
    }

    if (newOrderedIds.length != user.photos.length) {
      return this.BadRequest("BAD_DATA", `New order's length must be same with the user's photos length`);
    }

    const newPhotosArray: IPhotoModel[] = [];
    newOrderedIds.forEach(id => {
      const index = user.photos.findIndex(w => w.id == id);
      newPhotosArray.push(user.photos[index]);
    });

    user.photos = newPhotosArray;
    await this.userRepository.update(user);

    return this.ok();
  }
}
