import mongoose from "mongoose";
import {mongoosePagination} from "ts-mongoose-pagination";
import {IForumCategory} from "../../interfaces/forum/IForumCategory";
import autoPopulate = require('mongoose-autopopulate');


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
ForumCategory.plugin(require('mongoose-delete'), { overrideMethods: true });
export default mongoose.model<IForumCategory & mongoose.Document>('ForumCategory', ForumCategory);
