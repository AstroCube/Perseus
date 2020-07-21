import mongoose, {Schema} from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');
import {IForum} from "../../interfaces/forum/IForum";
import forumWare from "./middleware/forum";

const Forum = new mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
            required: true
        },
        order: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            default: ''
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'ForumCategory',
            required: true,
            autopopulate: true
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Forum',
            autopopulate: true
        },
        guest: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


Forum.post('init', forumWare.find);
Forum.plugin(mongoosePagination);
Forum.plugin(autoPopulate);
export default mongoose.model<IForum & mongoose.Document>('Forum', Forum);
