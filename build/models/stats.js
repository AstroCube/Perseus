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
const Stats = new mongoose.Schema({
    username: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        deaths: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        kits: [
            {
                type: String,
                default: ['glass']
            }
        ],
        cages: [
            {
                type: String,
                default: ['naturalist']
            }
        ],
        currentKit: {
            type: String,
            default: 'naturalist'
        },
        currentCage: {
            type: String,
            default: 'glass'
        }
    },
    tntGames: {
        runDoubleJump: { type: Number, default: 2 },
        coins: { type: Number, default: 0 }
    }
}, { timestamps: true });
Stats.plugin(ts_mongoose_pagination_1.mongoosePagination);
Stats.plugin(require('mongoose-autopopulate'));
exports.default = mongoose.model('Stats', Stats);
//# sourceMappingURL=stats.js.map