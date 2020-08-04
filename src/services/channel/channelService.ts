import { Service, Inject } from 'typedi';
import {IChannel} from "../../interfaces/channel/IChannel";
import Agenda from "agenda";
import {ResponseError} from "../../interfaces/error/ResponseError";

@Service()
export default class ChannelService {

    constructor(
        @Inject('channelModel') private channelModel: Models.ChannelModel,
        @Inject('channelMessageModel') private channelMessageModel: Models.ChannelMessageModel,
        @Inject('logger') private logger,
        @Inject('agendaInstance') private agenda: Agenda
    ) {}

    public async create(channel: IChannel): Promise<IChannel> {
        try {

            const available = await this.channelModel.findOne({name: channel.name});
            if (available) throw new ResponseError('The requested channel was already created', 400);

            const channelRecord: IChannel = await this.channelModel.create({...channel});

            if (channelRecord.lifecycle !== -1)
                await this.agenda.schedule(
                    new Date(Date.now() + channelRecord.lifecycle),
                'unregister-channel', {id: channelRecord._id}
                );

            return channelRecord;
        } catch (e) {
            this.logger.error('There was an error creating a message channel: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IChannel> {
        try {
            const channel = await this.channelModel.findById(id);
            if (!channel) throw new ResponseError('The requested channel could not be found', 400);
            return channel;
        } catch (e) {
            this.logger.error('There was an error obtaining a message channel: %o', e);
            throw e;
        }
    }

    public async update(channel: IChannel): Promise<IChannel> {
        try {
            const channelRecord = await this.channelModel.findByIdAndUpdate(channel._id, channel, {new: true});
            if (!channelRecord) throw new ResponseError('The requested channel could not be found', 400);
            return channelRecord;
        } catch (e) {
            this.logger.error('There was an error updating a message channel: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const messages = await this.channelMessageModel.find({channel: id});
            for (const m of messages) m.delete();
            await this.channelModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error deleting a message channel: %o', e);
            throw e;
        }
    }

}
