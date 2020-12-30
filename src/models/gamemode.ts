import mongoose from "mongoose";
import {IGamemode} from "../interfaces/IGamemode";
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
      pairing: { type: String, enum: ['Substraction', 'Limit', 'Multiplus', 'Solo'] },
      group: String
    }]
  },
  { timestamps: true }
);


Gamemode.plugin(mongoosePagination);
Gamemode.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IGamemode & mongoose.Document>('Gamemode', Gamemode);
