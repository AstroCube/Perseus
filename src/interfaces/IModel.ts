import * as mongodb from  "mongodb";

export interface IModel {

  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;

  delete(user?: mongodb.ObjectId): void;

}
