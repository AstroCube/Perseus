import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');
import {IAppeal} from "../interfaces/IAppeal";


const Appeal = new mongoose.Schema(
    {
        punishment: {
            type: Schema.Types.ObjectId,
            ref: 'Punishment',
            index: true,
            autopopulate: true
        },
        registeredAddress: String,
        actions: [
            {
                type: { type: String, enum: ['Open', 'Close', 'Comment', 'Lock', 'Unlock', 'Escalate', 'Create', 'Appeal', 'UnAppeal', 'Supervised'] },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    autopopulate: {
                        select: '-password -salt'
                    }
                },
                createdAt: Date,
                content: String
            }
        ],
        supervisor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        appealed: {
            type: Boolean,
            default: false
        },
        escalated: {
            type: Boolean,
            default: false
        },
        closed: {
            type: Boolean,
            default: false
        },
        locked: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


Appeal.plugin(mongoosePagination);
Appeal.plugin(autoPopulate);
Appeal.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IAppeal & mongoose.Document>('Appeal', Appeal);
