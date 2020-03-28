import mongoose from "mongoose";
import { ICluster } from "../interfaces/ICluster";


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

export default mongoose.model<ICluster & mongoose.Document>('Cluster', Cluster);
