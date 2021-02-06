import * as mongoose from "mongoose";
import {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IStats} from "../interfaces/IStats";

const Stats = new mongoose.Schema(
    {
        gameMode: {
            type: Schema.Types.ObjectId,
            ref: 'Gamemode'
        },
        match: {
            type: Schema.Types.ObjectId,
            ref: 'Match'
        },
        subGameMode: {
            type: String,
            required: true
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

Stats.plugin(mongoosePagination);
Stats.plugin(require('mongoose-autopopulate'));
Stats.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IStats & mongoose.Document>('Stats', Stats);
