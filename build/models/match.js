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
const Match = new mongoose_1.default.Schema({
    map: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Map'
    },
    createdAt: String,
    teams: [{
            _id: false,
            name: String,
            members: [{
                    _id: false,
                    user: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    joinedAt: String
                }],
            color: String
        }],
    winner: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    status: { type: String, enum: ['waiting', 'starting', 'ingame', 'finished', 'invalidated', 'forced'] },
    gamemode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Gamemode'
    },
    subGamemode: String
}, { timestamps: true });
exports.default = mongoose_1.default.model('Match', Match);
//# sourceMappingURL=match.js.map