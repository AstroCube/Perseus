import { IGroup } from "../interfaces/IGroup";
import * as mongoose from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";
import { Schema } from "mongoose";

const Group = new mongoose.Schema(
  {
    name: String,
    priority: Number,
    html_color: String,
    badge_color: String,
    badge_link: String,
    minecraft_flair: [
      {
        realm: String,
        color: String,
        symbol: String
      }
    ],
    minecraft_permissions: [{
      type: String
    }],
    staff: Boolean,
    discord_role: String,
    web_permissions: {
      user: {
        manage: Boolean
      },
      group: {
        manage: Boolean
      },
      category: {
        manage: Boolean
      },
      view_ips: Boolean,
      punishments: {
        manage: Boolean,
        create: {
          warn: Boolean,
          kick: Boolean,
          temp_ban: Boolean,
          ban: Boolean,
          forum_ban: Boolean
        }
      },
      appeals: {
        manage: Boolean,
        transitional: {
          comment: { type: String, enum: ['all', 'involved'] },
          close: { type: String, enum: ['all', 'involved'] },
          lock: Boolean,
          escalate: { type: String, enum: ['all', 'involved'] },
          appeal: { type: String, enum: ['all', 'involved'] }
        },
        assign_escalated: Boolean,
        view: { type: String, enum: ['all', 'involved'] }
      },
      maps: {
        manage: Boolean
      },
      forum: Schema.Types.Mixed,
      reports: {
        manage: Boolean,
        assign: Boolean,
        view: { type: String, enum: ['all', 'involved'] }
      }
      /*
        manage: Boolean,
        official: Boolean,
        "forum_id": {
          manage: Boolean,
          create: Boolean,
          view: String ("own", "none", "all"),
          edit: String ("own", "none", "all"),
          comment: String ("own", "none", "all"),
          delete: Boolean,
          pin: Boolean,
          lock: Boolean
        }
      */
    }
  },
  { timestamps: true }
);

Group.plugin(mongoosePagination);
Group.plugin(require('mongoose-autopopulate'));
export default mongoose.model<IGroup & mongoose.Document>('Group', Group);
