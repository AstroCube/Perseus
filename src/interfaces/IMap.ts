import {IModel} from "./IModel";
import {IUser} from "./IUser";

export interface IMap extends IModel {
  name: string;
  identifierName: string;
  author: string | IUser;
  contributors: IMapContributors[];
  gamemode: string;
  subGamemode: string[];
  description: string;
  rating: IMapRating[];
  versions: IMapVersion[];
}

export interface IMapVersion {
  version: string;
  file: string;
  image: string;
  configuration: string;
}

export interface IMapContributors {
  contributor: string | IUser;
  contribution: string;
}

export interface IMapRating {
  star: number;
  user: string;
}
