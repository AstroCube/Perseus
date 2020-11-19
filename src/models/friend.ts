import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IFriend} from "../interfaces/IFriend";
import autoPopulate = require('mongoose-autopopulate');


const Friend = new mongoose.Schema(
  {
      sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          autopopulate: true
      },
      receiver: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
          autopopulate: true
      },
      issuer: {
          type: Schema.Types.ObjectId,
          ref: 'User'
      }
  },
  { timestamps: true }
);


Friend.plugin(mongoosePagination);
Friend.plugin(autoPopulate);
Friend.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IFriend & mongoose.Document>('Friend', Friend);
