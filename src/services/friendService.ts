import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IAppeal, IAppealAction, IAppealActionType, IAppealCreation} from "../interfaces/IAppeal";
import {IUser} from "../interfaces/IUser";
import {IAppealPermissible, IAppealsPermissions} from "../interfaces/permissions/IAppealsPermissions";
import PunishmentService from "./punishmentService";
import {IPunishment} from "../interfaces/IPunishment";
import dotty = require('dotty');
import {ResponseError} from "../interfaces/error/ResponseError";
import {IFriend, IFriendProfile} from "../interfaces/IFriend";

@Service()
export default class FriendService {

    constructor(
        @Inject('friendModel') private friendModel : Models.FriendModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: IFriend): Promise<IFriend> {
        try {
            const friend: IFriend = await this.friendModel.create(request);
            if (!friend) throw new ResponseError('There was an error creating friend request', 404);
            return friend;
        } catch (e) {
            this.logger.error('There was an error creating a friend request: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IFriend> {
        try {
            const friend: IFriend = await this.friendModel.findById(id);
            if (!friend) throw new ResponseError('The requested friendship was not found', 404);
            return friend;
        } catch (e) {
            this.logger.error('There was an error obtaining a friend request: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IFriend>> {
        try {
            return await this.friendModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error obtaining friend list: %o', e);
            throw e;
        }
    }

    public async profile(profile: string, user?: IUser): Promise<IFriendProfile> {
        try {
            const userFriends: IFriend[] =
                await this.friendModel.find(
                    {
                        $or: [
                            {sender: profile},
                            {receiver: profile}
                        ]
                    })
                    .populate("sender receiver");


            let friendsId = [];
            userFriends.forEach(friend => {
                if ((friend.sender as IUser)._id.toString() === profile) friendsId.push((friend.receiver as IUser)._id);
                if ((friend.receiver as IUser)._id.toString() === profile) friendsId.push((friend.sender as IUser)._id);
            });

            const common: IFriend[] = user ? await this.friendModel.find(
                {
                    $or: [
                        {sender: user._id, receiver: {$in: friendsId}},
                        {receiver: user._id, sender: {$in: friendsId}}
                    ]
                }
            ) : [];

            return {commons: common.length, friends: userFriends};

        } catch (e) {
            this.logger.error('There was an error obtaining friend profile list: %o', e);
            throw e;
        }
    }

    public async delete(request: IFriend): Promise<void> {
        try {
            await this.friendModel.findOneAndDelete({
                $or: [
                    {
                        sender: request.sender,
                        receiver: request.receiver
                    },
                    {
                        receiver: request.sender,
                        sender: request.receiver
                    }
                ]
            });
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

}
