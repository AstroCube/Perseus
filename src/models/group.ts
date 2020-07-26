import { IGroup } from "../interfaces/IGroup";
import * as mongoose from "mongoose";
import { mongoosePagination } from "ts-mongoose-pagination";

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
          ban: Boolean
        }
      },
      appeals: {
        manage: Boolean,
        transactional: {
          comment: { type: String, enum: ['All', 'Involved'] },
          close: { type: String, enum: ['All', 'Involved'] },
          lock: Boolean,
          escalate: { type: String, enum: ['All', 'Involved'] },
          appeal: { type: String, enum: ['All', 'Involved'] }
        },
        assign_escalated: Boolean,
        view: { type: String, enum: ['All', 'Involved'] }
      },
      maps: {
        manage: Boolean
      },
      forum: {
          manage: Boolean,
          official: Boolean,
          allowance: [
              {
                  id: String,
                  manage: Boolean,
                  create: Boolean,
                  view: { type: String, enum: ['All', 'Own', 'None'] },
                  edit: { type: String, enum: ['All', 'Own', 'None'] },
                  comment: { type: String, enum: ['All', 'Own', 'None'] },
                  delete: Boolean,
                  pin: Boolean,
                  lock: Boolean
              }
          ]
      },
      reports: {
        manage: Boolean,
        assign: Boolean,
        view: { type: String, enum: ['All', 'Involved'] }
      }
    }
  },
  { timestamps: true }
);

Group.plugin(mongoosePagination);
Group.plugin(require('mongoose-autopopulate'));
Group.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IGroup & mongoose.Document>('Group', Group);
