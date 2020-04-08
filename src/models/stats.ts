import * as mongoose from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";
import { Schema } from "mongoose";
import { IStats } from "../interfaces/IStats";

const Stats = new mongoose.Schema(
  {
    username: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      unique: true,
      lowercase: true
    },
    dungeon: {
      squamas: { type: Number, default: 0 },
      crowns: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      helmet: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      },
      chestplate: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      },
      leggings: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      },
      boots: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      },
      sword: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      },
      bow: {
        material: {
          type: Number,
          default: 0
        },
        pe: [
          {
            enchantment: String,
            level: Number
          }
        ]
      }
    },
    skyWars: {
      kills: { type: Number, default: 0 },
      deaths: {type: Number, default: 0},
      coins: { type: Number, default: 0 },
      kits: [
        String
      ],
      cages: [
        String
      ],
      currentKit: String,
      currentCage: String
    },
    tntGames: {
      runDoubleJump: {type: Number, default: 2},
      coins: {type: Number, default: 0}
    }
  },
  { timestamps: true }
);

Stats.plugin(mongoosePagination);
Stats.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IStats & mongoose.Document>('Stats', Stats);
