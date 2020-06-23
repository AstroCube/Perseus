import {IModel} from "./IModel";
import {IUser} from "./IUser";

export interface IMap extends IModel {
  name: string;
  identifierName: string;
  file: string;
  configuration: string;
  image: string;
  author: string | IUser;
  version: string;
  contributors: IMapContributors[];
  gamemode: string;
  subGamemode: string[];
  description: string;
  rating: IMapRating[];
}

export interface IMapContributors {
  contributor: string | IUser;
  contribution: string;
}

export interface IMapRating {
  star: number;
  user: string;
}
