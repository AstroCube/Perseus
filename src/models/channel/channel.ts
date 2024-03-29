import mongoose, {Schema} from "mongoose";
import {IChannel} from "../../interfaces/channel/IChannel";


const Channel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        lifecycle: {
            type: Number,
            default: -1
        },
        confirmation: {
            type: Boolean,
            default: false
        },
        visibility: {
            type: String,
            enum: ['Public', 'Private', 'Permissions'],
            default: 'Public'
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        permission: String
    },
    { timestamps: true }
);

export default mongoose.model<IChannel & mongoose.Document>('Channel', Channel);
