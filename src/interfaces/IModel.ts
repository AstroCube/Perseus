import * as mongoose from "mongoose";

export interface IModel {

  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;

  delete(user?: mongoose.Types.ObjectId): void;

}
