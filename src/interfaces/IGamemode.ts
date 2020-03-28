export interface IGamemode {
  name: string;
  lobby: string;
  navigator: string;
  slot: number;
  subTypes: ISubGamemode[];
}

export interface ISubGamemode {
  name: string;
  selectable_map: string;
  min_players: number;
  max_players: number;
  permission: string;
  group: string;
}
