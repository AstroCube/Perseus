import { Service, Inject } from 'typedi';
import {IChannel} from "../../interfaces/channel/IChannel";
import Agenda from "agenda";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IChannelMessage} from "../../interfaces/channel/IChannelMessage";

@Service()
export default class ChannelMessageService {

    constructor(
        @Inject('channelMessageModel') private channelMessageModel: Models.ChannelMessageModel,
        @Inject('logger') private logger,
        @Inject('agendaInstance') private agenda: Agenda
    ) {}

    public async create(channel: IChannelMessage): Promise<IChannelMessage> {
        try {
            const channelRecord = await this.channelMessageModel.create(channel);
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
