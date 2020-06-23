import mongoose, {Schema} from "mongoose";
import { IMatch } from "../interfaces/IMatch";


const Match = new mongoose.Schema(
  {
    map: {
      type: Schema.Types.ObjectId,
      ref: 'Map'
    },
    createdAt: String,
    teams: [{
      _id: false,
      name: String,
      members: [{
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        joinedAt: String
      }],
      color: String
    }],
    winner: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: { type: String, enum: ['Preparing', 'Waiting', 'Starting', 'Ingame', 'Finished', 'Invalidated', 'Forced']},
    gamemode: {
      type: Schema.Types.ObjectId,
      ref: 'Gamemode'
    },
    subGamemode: String
  },
  { timestamps: true }
);

export default mongoose.model<IMatch & mongoose.Document>('Match', Match);
