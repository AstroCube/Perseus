import mongoose, {Schema} from "mongoose";
import {IChannelMessage} from "../../interfaces/channel/IChannelMessage";


const ChannelMessage = new mongoose.Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        origin: {
            type: String,
            enum: ['InGame', 'Website'],
            default: 'Website'
        },
        viewed: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        meta: Schema.Types.Mixed
    },
    { timestamps: true }
);

export default mongoose.model<IChannelMessage & mongoose.Document>('ChannelMessage', ChannelMessage);
