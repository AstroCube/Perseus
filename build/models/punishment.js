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
const autoPopulate = require("mongoose-autopopulate");
const Punishment = new mongoose_1.default.Schema({
    type: { type: String, enum: ['Warn', 'Kick', 'Ban'] },
    issuer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    punished: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    server: String,
    match: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Match'
    },
    lastIp: String,
    silent: Boolean,
    reason: String,
    evidence: String,
    expires: Number,
    automatic: Boolean,
    appealed: Boolean,
    active: Boolean
}, { timestamps: true });
Punishment.plugin(ts_mongoose_pagination_1.mongoosePagination);
Punishment.plugin(autoPopulate);
exports.default = mongoose_1.default.model('Punishment', Punishment);
//# sourceMappingURL=punishment.js.map