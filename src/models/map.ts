import mongoose, { Schema } from "mongoose";
import { IMap } from "../interfaces/IMap";


const Map = new mongoose.Schema(
  {
    name: String,
    identifierName: {
        type: String,
        index: true,
        unique: true,
        lowercase: true
    },
    file: {
        type: String,
        unique: true
    },
    configuration: {
        type: String,
        unique: true
    },
    image: {
        type: String,
        unique: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    version: String,
    contributors: [{
      _id: false,
      contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      contribution: String
    }],
    gamemode: {
      type: Schema.Types.ObjectId,
      ref: 'Gamemode'
    },
    subGamemode: [
      String
    ],
    description: String,
    rating: [
      {
        _id: false,
        star: { type: Number, enum: [1, 2, 3, 4, 5] },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IMap & mongoose.Document>('Map', Map);
