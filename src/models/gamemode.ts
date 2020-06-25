import mongoose from "mongoose";
import { IGamemode } from "../interfaces/IGamemode";
import {mongoosePagination} from "ts-mongoose-pagination";


const Gamemode = new mongoose.Schema(
  {
    lobby: String,
    navigator: String,
    slot: Number,
    subTypes: [{
      _id: false,
      name: String,
      selectableMap: Boolean,
      minPlayers: Number,
      maxPlayers: Number,
      permission: String,
      group: String
    }]
  },
  { timestamps: true }
);


Gamemode.plugin(mongoosePagination);
export default mongoose.model<IGamemode & mongoose.Document>('Gamemode', Gamemode);
