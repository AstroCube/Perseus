export interface IMap {
  name: string;
  file: string;
  configuration: string;
  image: string;
  author: string;
  version: string;
  contributors: IMapContributors[];
  gamemode: string;
  subGamemode: string[];
  description: string;
  rating: IMapRating[];
}

export interface IMapContributors {
  contributor: string;
  contribution: string;
}

export interface IMapRating {
  star: number;
  user: string;
}
