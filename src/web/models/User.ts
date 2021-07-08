import Sex from "../../core/constants/Sex";
import { IUserDocument } from "../../data/schemas/user.schema";
import { Photo } from "./Photo";

export class User {
  id?: any;
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  birthdate?: Date;
  sex?: Sex;
  photos?: Photo[];
  aboutMe?: string;
  jobTitle?: string;
  company?: string;
  school?: string;

  static fromUserDocument(userDocument: IUserDocument): User {
    const user = new User();
    user.id = userDocument.id;
    user.firstname = userDocument.firstname;
    user.lastname = userDocument.lastname;
    user.email = userDocument.email;
    user.phone = userDocument.phone;
    user.birthdate = userDocument.birthdate;
    user.photos = Photo.fromPhotoModelArray(userDocument.photos);
    user.aboutMe = userDocument.aboutMe;
    user.jobTitle = userDocument.jobTitle;
    user.company = userDocument.company;
    user.school = userDocument.school;

    return user;
  }

  static fromUserDocumentArray(userDocumentArray: IUserDocument[]): User[] {
    const list: User[] = [];

    for (let i = 0; i < userDocumentArray.length; i++) {
      list.push(this.fromUserDocument(userDocumentArray[i]));
    }

    return list;
  }
}
