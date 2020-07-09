import mongoose, { Schema } from "mongoose";
import { IServer } from "../interfaces/IServer";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');


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
    cluster: {
      type: Schema.Types.ObjectId,
      ref: 'Cluster'
    }
  },
  { timestamps: true }
);

Server.plugin(mongoosePagination);
Server.plugin(autoPopulate);
export default mongoose.model<IServer & mongoose.Document>('Server', Server);
