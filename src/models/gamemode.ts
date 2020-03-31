import mongoose from "mongoose";
import { IGamemode } from "../interfaces/IGamemode";


const Gamemode = new mongoose.Schema(
  {
    lobby: String,
    navigator: String,
    slot: Number,
    subTypes: [{
      _id: false,
      name: String,
      selectableMap: String,
      minPlayers: Number,
      maxPlayers: Number,
      permission: String,
      group: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model<IGamemode & mongoose.Document>('Gamemode', Gamemode);
