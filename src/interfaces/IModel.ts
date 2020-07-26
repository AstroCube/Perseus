import {Schema} from "mongoose";

export interface IModel {
  _id: string;
  createdAt: string;
  updatedAt: string;

  deleted(): boolean;

  deletedAt(): string;

  deletedBy(): string;

  delete(user?: Schema.Types.ObjectId): void;

}
