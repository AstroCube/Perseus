import mongoose, {Schema} from "mongoose";
import {IPunishment} from "../interfaces/IPunishment";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');


const Punishment = new mongoose.Schema(
    {
        type: { type: String, enum: ['Warn', 'Kick', 'Ban'] },
        issuer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        punished: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        server: {
            type: String,
            default: 'Website'
        },
        match: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            autopopulate: true
        },
        lastIp: String,
        silent: Boolean,
        reason: String,
        evidence: String,
        expires: {
            type: Number,
            default: -1
        },
        automatic: {
            type: Boolean,
            default: false
        },
        appealed: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);


Punishment.plugin(mongoosePagination);
Punishment.plugin(autoPopulate);
Punishment.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IPunishment & mongoose.Document>('Punishment', Punishment);
