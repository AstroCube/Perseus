import { IUser } from '../interfaces/IUser';
import mongoose, { Schema } from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";


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
      lastGame: String,
      lastLobby: String,
      premium: Boolean
    },
    verified: Boolean,
    level: Number,
    experience: Number,
    address: [{
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
    language: String,
    publicInfo: {
      gender: Number,
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
        active: Boolean,
        logs: Boolean,
        punishments: Boolean
      },
      general: {
        gifts: Boolean,
        friends: Boolean,
        parties: Boolean,
        status: Boolean,
        hiding: Boolean
      }
    }
  },
  { timestamps: true }
);

User.plugin(mongoosePagination);
export default mongoose.model<IUser & mongoose.Document>('User', User);
