"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const ts_mongoose_pagination_1 = require("ts-mongoose-pagination");
const mongoose_1 = require("mongoose");
const Group = new mongoose.Schema({
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
        forum: mongoose_1.Schema.Types.Mixed,
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
}, { timestamps: true });
Group.plugin(ts_mongoose_pagination_1.mongoosePagination);
Group.plugin(require('mongoose-autopopulate'));
exports.default = mongoose.model('Group', Group);
//# sourceMappingURL=group.js.map