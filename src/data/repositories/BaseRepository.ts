import { Document, Model } from "mongoose";
import { unmanaged, injectable } from "inversify";

@injectable()
export abstract class BaseRepository<TDocument extends Document, T> {
  private readonly model: Model<TDocument>;

  constructor(@unmanaged() model: Model<TDocument>) {
    this.model = model;
  }

  find = async (filter?: T) => {
    return this.model.find(filter || {});
  };

  findById = async (id: string) => {
    return this.model.findOne({ _id: id });
  };

  create = async (item: T) => {
    return this.model.create(item);
  };

  update = async (item: TDocument) => {
    return item.save();
  };

  deleteById = async (id: string) => {
    return this.model.deleteOne({ _id: id });
  };

  delete = async (item: TDocument) => {
    return item.remove();
  };
}
