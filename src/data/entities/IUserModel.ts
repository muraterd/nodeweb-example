import Sex from "../../core/constants/Sex";

export interface IUserModel {
  id?: any;
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  birthdate?: Date;
  sex?: Sex;
  aboutMe?: string;
  jobTitle?: string;
  company?: string;
  school?: string;
  photos?: IPhotoModel[];
  createdAt?: Date;
}

export interface IPhotoModel {
  id?: any;
  filename?: string;
  mimetype?: string;
  originalname?: string;
  createdAt?: Date;
  testUrl?: string;
}
