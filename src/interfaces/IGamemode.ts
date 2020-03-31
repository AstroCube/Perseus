export interface IGamemode {
  name: string;
  lobby: string;
  navigator: string;
  slot: number;
  subTypes: ISubGamemode[];
}

export interface ISubGamemode {
  name: string;
  selectableMap: string;
  minPlayers: number;
  maxPlayers: number;
  permission: string;
  group: string;
}
