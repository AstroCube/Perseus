import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IGoal} from "../interfaces/stats/IGoal";

const Goal = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        match: {
            type: Schema.Types.ObjectId,
            ref: 'Match',
            required: true,
        },
        gamemode: {
            type: Schema.Types.ObjectId,
            ref: 'Gamemode',
            required: true,
        },
        subGamemode: {
            type: Schema.Types.ObjectId,
            ref: 'SubGamemode',
            required: true,
        },
        objective : String,
        meta: Schema.Types.Mixed
    },
    { timestamps: true }
);

Goal.plugin(mongoosePagination);
export default mongoose.model<IGoal & mongoose.Document>('Goal', Goal);