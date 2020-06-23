import mongoose, { Schema } from "mongoose";
import { IServer } from "../interfaces/IServer";
import {mongoosePagination} from "ts-mongoose-pagination";


const Server = new mongoose.Schema(
  {
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true
    },
    type: { type: String, enum: ['Lobby', 'Game', 'Special', 'Bungee'] },
    gamemode: {
      type: Schema.Types.ObjectId,
      ref: 'Gamemode'
    },
    subGamemode: String,
    maxRunning: {type: Number, default: 1},
    maxTotal: {type: Number, default: 1},
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    cluster: {
      type: Schema.Types.ObjectId,
      ref: 'Cluster'
    },
    matches: [{
      type: Schema.Types.ObjectId,
      ref: 'Match'
    }]
  },
  { timestamps: true }
);

Server.plugin(mongoosePagination);
export default mongoose.model<IServer & mongoose.Document>('Server', Server);
