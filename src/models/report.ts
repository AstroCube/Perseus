import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');
import {IReport} from "../interfaces/IReport";


const Report = new mongoose.Schema(
    {
        punishment: {
            type: Schema.Types.ObjectId,
            ref: 'Punishment',
            index: true,
            autopopulate: true
        },
        issuer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        involved: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        assigned: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: {
                select: '-password -salt'
            }
        },
        registeredAddress: String,
        actions: [
            {
                type: { type: String, enum: ['Open', 'Close', 'Comment', 'Punish'] },
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
        rule: {
            type: String,
            default: ''
        },
        evidence: {
            type: String,
            default: ''
        },
        miscellaneous: {
            type: String,
            default: ''
        },
        closed: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);


Report.plugin(mongoosePagination);
Report.plugin(autoPopulate);
Report.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IReport & mongoose.Document>('Report', Report);
