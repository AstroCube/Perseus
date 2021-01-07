import {Inject, Service} from 'typedi';
import Agenda from "agenda";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IChannelMessage} from "../../interfaces/channel/IChannelMessage";
import {IPaginateResult} from "mongoose";
import {IChannel} from "../../interfaces/channel/IChannel";
const ObjectId = require('mongoose').Types.ObjectId;

@Service()
export default class ChannelMessageService {

    constructor(
        @Inject('channelMessageModel') private channelMessageModel: Models.ChannelMessageModel,
        @Inject('channelModel') private channelModel: Models.ChannelModel,
        @Inject('logger') private logger,
        @Inject('agendaInstance') private agenda: Agenda
    ) {}

    public async create(channel: IChannelMessage): Promise<IChannelMessage> {
        try {

            let finalChannelId: string = channel.channel as string;

            if (!ObjectId.isValid(channel.channel as string)) {

                const channelByName: IChannel = await this.channelModel.findOne({name: channel.channel} as IChannel);

                if (!channelByName) throw new ResponseError('Requested channel could not be found', 404);

                finalChannelId = channelByName._id;

            }


            const channelRecord = await this.channelMessageModel.create({...channel, channel: finalChannelId});
            if (!channelRecord) throw new ResponseError('The message was not recorded successfully', 500);
            return channelRecord;
        } catch (e) {
            this.logger.error('There was an error obtaining a message channel: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IChannelMessage> {
        try {
            const channelMessage = await this.channelMessageModel.findById(id);
            if (!channelMessage) throw new ResponseError('The requested channel could not be found', 400);
            return channelMessage;
        } catch (e) {
            this.logger.error('There was an error obtaining a message channel: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IChannelMessage>> {
        try {
            return await this.channelMessageModel.paginate(query, {...options});
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async update(message: IChannelMessage): Promise<IChannelMessage> {
        try {
            const messageRecord = await this.channelMessageModel.findByIdAndUpdate(message._id, message, {new: true});
            if (!messageRecord) throw new ResponseError('The requested channel could not be found', 400);
            return messageRecord;
        } catch (e) {
            this.logger.error('There was an error obtaining a message channel: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const messages = await this.channelMessageModel.find({channel: id});
            for (const m of messages) m.delete();
            await this.channelMessageModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error obtaining a message channel: %o', e);
            throw e;
        }
    }

}
