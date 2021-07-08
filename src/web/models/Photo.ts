import { IPhotoModel } from "../../data/entities/IUserModel";
import uuid from "uuid";

export class Photo {
  id: any;
  fileUrl: string;

  constructor(id: any, filename: string) {
    this.id = id;
    this.fileUrl = `${process.env.API_URL}/uploads/${filename}`;
  }

  static fromPhotoModel(photoModel: IPhotoModel): Photo {
    const id = uuid();
    return photoModel.testUrl ? { id: id, fileUrl: photoModel.testUrl } : new Photo(photoModel.id, photoModel.filename);
  }

  static fromPhotoModelArray(array: IPhotoModel[]) {
    const photoArray: Photo[] = [];

    array.forEach(photoModel => {
      photoArray.push(this.fromPhotoModel(photoModel));
    });

    return photoArray;
  }
}
