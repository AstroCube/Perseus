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
const mongoose_1 = __importStar(require("mongoose"));
const ts_mongoose_pagination_1 = require("ts-mongoose-pagination");
const User = new mongoose_1.default.Schema({
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Group',
                autopopulate: true
            },
            joined: mongoose_1.Schema.Types.Date,
            comment: String
        }],
    skin: String,
    session: {
        lastSeen: { type: Date, default: Date.now },
        online: { type: Boolean, default: false },
        lastGame: { type: String, default: "register" },
        lastLobby: { type: String, default: "main_lobby" },
        premium: { type: Boolean, default: false }
    },
    verified: { type: Boolean, default: false },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
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
    language: { type: String, default: 'es' },
    publicInfo: {
        gender: { type: Number, default: 0 },
        occupation: String,
        interests: String,
        email: String,
        location: String,
        twitter: String,
        reddit: String,
        steam: String,
        twitch: String,
        about: String
    },
    settings: {
        adminChat: {
            active: { type: Boolean, default: false },
            logs: { type: Boolean, default: false },
            punishments: { type: Boolean, default: false }
        },
        general: {
            gifts: { type: Boolean, default: false },
            friends: { type: Boolean, default: false },
            parties: { type: Boolean, default: false },
            status: { type: Boolean, default: false },
            hiding: { type: Boolean, default: false }
        },
        forum: {
            subscribe: { type: Boolean, default: false },
            quoteAlert: { type: Boolean, default: false }
        }
    }
}, { timestamps: true });
User.plugin(ts_mongoose_pagination_1.mongoosePagination);
User.plugin(require('mongoose-autopopulate'));
exports.default = mongoose_1.default.model('User', User);
//# sourceMappingURL=user.js.map