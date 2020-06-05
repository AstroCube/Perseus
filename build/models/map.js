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
const Map = new mongoose_1.default.Schema({
    name: String,
    nameLowercase: String,
    file: String,
    configuration: String,
    image: String,
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    version: String,
    contributors: [{
            _id: false,
            contributor: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            },
            contribution: String
        }],
    gamemode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Gamemode'
    },
    subGamemode: [
        String
    ],
    description: String,
    rating: [
        {
            _id: false,
            star: { type: Number, enum: [1, 2, 3, 4, 5] },
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
}, { timestamps: true });
exports.default = mongoose_1.default.model('Map', Map);
//# sourceMappingURL=map.js.map