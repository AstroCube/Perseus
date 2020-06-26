import mongoose, {Schema} from "mongoose";
import { IGamemode } from "../interfaces/IGamemode";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IFriend} from "../interfaces/IFriend";


const Friend = new mongoose.Schema(
  {
      senderr: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
      },
      receiver: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
      },
      issuer: {
          type: Schema.Types.ObjectId,
          ref: 'User'
      }
  },
  { timestamps: true }
);


Friend.plugin(mongoosePagination);
export default mongoose.model<IFriend & mongoose.Document>('Friend', Friend);
