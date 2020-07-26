import mongoose from "mongoose";
import { ICluster } from "../interfaces/ICluster";
import {mongoosePagination} from "ts-mongoose-pagination";


const Cluster = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  { timestamps: true }
);

Cluster.plugin(mongoosePagination);
Cluster.plugin(require('mongoose-delete'));
export default mongoose.model<ICluster & mongoose.Document>('Cluster', Cluster);
