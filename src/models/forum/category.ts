import mongoose from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import autoPopulate = require('mongoose-autopopulate');
import {IForumCategory} from "../../interfaces/forum/IForumCategory";


const ForumCategory = new mongoose.Schema(
    {
        name: {
            type: String,
            index: true,
            required: true,
            unique: true
        },
        order: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);


ForumCategory.plugin(mongoosePagination);
ForumCategory.plugin(autoPopulate);
export default mongoose.model<IForumCategory & mongoose.Document>('ForumCategory', ForumCategory);
