import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IPost} from "../../interfaces/forum/IPost";
import autoPopulate = require('mongoose-autopopulate');

const Post = new mongoose.Schema(
    {
        content: {
            type: String,
            index: true,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            autopopulate: true
        },
        quote: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            autopopulate: true
        },
        lastAction: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            autopopulate: true
        },
        liked: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        viewed: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    { timestamps: true }
);


Post.plugin(mongoosePagination);
Post.plugin(autoPopulate);
Post.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IPost & mongoose.Document>('Post', Post);
