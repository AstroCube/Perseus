import mongoose, {Schema} from "mongoose";
import { IMatch } from "../interfaces/IMatch";
import {mongoosePagination} from "ts-mongoose-pagination";


const Match = new mongoose.Schema(
    {
        map: {
            type: Schema.Types.ObjectId,
            ref: 'Map'
        },
        createdAt: String,
        teams: [{
            _id: false,
            name: String,
            members: [{
                _id: false,
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                joinedAt: String
            }],
            color: String
        }],
        spectators: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        pending: [{
            responsible: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            involved: [{
                type: Schema.Types.ObjectId,
                ref: 'User'
            }]
        }],
        server: {
            type: Schema.Types.ObjectId,
            ref: 'Server'
        },
        winner: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        status: { type: String, enum: ['Preparing', 'Waiting', 'Starting', 'Ingame', 'Finished', 'Invalidated', 'Forced']},
        gamemode: {
            type: Schema.Types.ObjectId,
            ref: 'Gamemode'
        },
        subGamemode: String,
        query: Schema.Types.Mixed,
        requestedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

Match.plugin(mongoosePagination);
Match.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IMatch & mongoose.Document>('Match', Match);
