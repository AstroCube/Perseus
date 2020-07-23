import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');
import {ITopic} from "../../interfaces/forum/ITopic";


const Topic = new mongoose.Schema(
    {
        subject: {
            type: String,
            index: true,
            required: true,
            unique: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            autopopulate: true
        },
        forum: {
            type: Schema.Types.ObjectId,
            ref: 'ForumHolder',
            required: true,
            autopopulate: true
        },
        subscribers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        pinned: {
            type: Boolean,
            default: false
        },
        official: {
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


Topic.plugin(mongoosePagination);
Topic.plugin(autoPopulate);

export default mongoose.model<ITopic & mongoose.Document>('Topic', Topic);
