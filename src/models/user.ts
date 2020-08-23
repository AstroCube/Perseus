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
      index: true,
      spare: true
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
      lastSeen: { type: Date, default: Date.now },
      online: {type: Boolean, default: false},
      lastGame: {type: String, default: "register"},
      lastLobby: {type: String, default: "main_lobby"},
      authorize: {type: String, default: "Password", enum: ['Password', 'Premium'] }
    },
    verified: {type: Boolean, default: false},
    level: {type: Number, default: 1},
    experience: {type: Number, default: 0},
    address: [{
      _id: false,
      number: String,
      country: String,
      primary: Boolean
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
      occupation: {type: String, default: ''},
      interests: {type: String, default: ''},
      email: {type: String, default: ''},
      location: {type: String, default: ''},
      twitter: {type: String, default: ''},
      reddit: {type: String, default: ''},
      steam: {type: String, default: ''},
      twitch: {type: String, default: ''},
      about: {type: String, default: ''}
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
        hiding: {type: Boolean, default: false},
        hideType: {type: String, default: 'Default', enum: ['Alone', 'Friendless', 'Default']}
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
User.plugin(require('mongoose-autopopulate'));
User.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IUser & mongoose.Document>('User', User);
