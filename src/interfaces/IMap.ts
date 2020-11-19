import {IModel} from "./IModel";
import {IUser} from "./IUser";

export interface IMap extends IMapBase, IModel {
}

export interface IMapCreation extends IMapBase, IMapVersion {}

export interface IMapBase {
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
