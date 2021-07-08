import { IUserModel, IPhotoModel } from "../../../data/entities/IUserModel";
import moment from "moment";
import Sex from "../../../core/constants/Sex";

export class UsersControllerHelper {
  static createRandomUser = (): IUserModel => {
    return {
      firstname: Math.random().toString(),
      lastname: Math.random().toString(),
      createdAt: moment().toDate(),
      birthdate: moment()
        .add(25, "years")
        .toDate(),
      email: "example@mail.com",
      phone: "905555555555",
      sex: Sex.Female,
      photos: UsersControllerHelper.createRandomPhotos(10)
    };
  };

  static createRandomPhotos = (count: number): IPhotoModel[] => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({ testUrl: `https://picsum.photos/600/600/?random?${Math.random()}` });
    }
    return list;
  };
}
