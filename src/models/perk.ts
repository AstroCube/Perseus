import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IStats} from "../interfaces/IStats";
import {IPerk} from "../interfaces/IPerk";

const Perk = new mongoose.Schema(
    {
        gameMode: {
            type: Schema.Types.ObjectId,
            ref: 'Gamemode'
        },
        subGameMode: {
            type: String,
            required: true
        },
        responsible: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        type: {
            type: String,
            required: true
        },
        statistic: {
            type: Schema.Types.Mixed
        },
    },
    { timestamps: true }
);

Perk.plugin(mongoosePagination);
Perk.plugin(require('mongoose-autopopulate'));
Perk.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IPerk & mongoose.Document>('Perk', Perk);
