import { IGroup } from "../interfaces/IGroup";
import * as mongoose from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";

const Group = new mongoose.Schema(
  {
  },
  { timestamps: true }
);

Group.plugin(mongoosePagination);
Group.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IGroup & mongoose.Document>('Group', Group);
