import mongoose, {Schema} from "mongoose";
import {IPunishment} from "../interfaces/IPunishment";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');


const Punishment = new mongoose.Schema(
    {
        type: { type: String, enum: ['Warn', 'Kick', 'Ban'] },
        issuer: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        punished: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        server: String,
        match: {
            type: Schema.Types.ObjectId,
            ref: 'Match'
        },
        lastIp: String,
        silent: Boolean,
        reason: String,
        evidence: String,
        expires: String,
        automatic: Boolean,
        appealed: Boolean,
        active: Boolean
    },
    { timestamps: true }
);


Punishment.plugin(mongoosePagination);
Punishment.plugin(autoPopulate);
export default mongoose.model<IPunishment & mongoose.Document>('Punishment', Punishment);
