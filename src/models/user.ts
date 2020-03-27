import { IUser } from '../interfaces/IUser';
import mongoose, { Schema } from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";
import * as autopopulate from "mongoose-autopopulate";


const User = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      lowercase: true
    },
    display: String,
    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },
    password: String,
    salt: String,
    groups: [{
      _id: false,
      group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        autopopulate: true
      },
      joined: Schema.Types.Date,
      comment: String
    }],
    skin: String,
    session: {
      lastSeen: Number,
      lastGame: {type: String, default: "register"},
      lastLobby: {type: String, default: "main_lobby"},
      premium: {type: Boolean, default: false}
    },
    verified: {type: Boolean, default: false},
    level: {type: Number, default: 1},
    experience: {type: Number, default: 0},
    address: [{
      _id: String,
      number: String,
      country: String,
      primary: String
    }],
    discord: {
      id: String,
      access: String,
      refresh: String,
      stamp: String
    },
    language: {type: String, default: 'es'},
    publicInfo: {
      gender: {type: Number, default: 0},
      occupation: String,
      interests: String,
      email: String,
      twitter: String,
      reddit: String,
      steam: String,
      twitch: String,
      about: String
    },
    settings: {
      adminChat: {
        active: {type: Boolean, default: false},
        logs: {type: Boolean, default: false},
        punishments: {type: Boolean, default: false}
      },
      general: {
        gifts: {type: Boolean, default: false},
        friends: {type: Boolean, default: false},
        parties: {type: Boolean, default: false},
        status: {type: Boolean, default: false},
        hiding: {type: Boolean, default: false}
      },
      forum: {
        subscribe: {type: Boolean, default: false},
        quoteAlert: {type: Boolean, default: false}
      }
    }
  },
  { timestamps: true }
);

User.plugin(mongoosePagination);
User.plugin(autopopulate);
export default mongoose.model<IUser & mongoose.Document>('User', User);
