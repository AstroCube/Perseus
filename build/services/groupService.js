"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let GroupService = class GroupService {
    constructor(userModel, groupModel, logger) {
        this.userModel = userModel;
        this.groupModel = groupModel;
        this.logger = logger;
    }
    async createGroup(group, user) {
        try {
            const groupRecord = await this.groupModel.create(Object.assign(Object.assign({}, group), { createdBy: user._id }));
            if (!groupRecord)
                throw new Error("There was an error creating a group.");
            return groupRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async viewGroup(id) {
        try {
            const groupRecord = await this.groupModel.findById(id);
            if (!groupRecord)
                throw new Error("Queried group does not exist.");
            return groupRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async listGroup(page) {
        try {
            return await this.groupModel.paginate({}, { page: page, perPage: 10 });
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async updateGroup(id, updatable) {
        try {
            const groupRecord = await this.groupModel.findByIdAndUpdate(id, updatable, { new: true });
            if (!groupRecord)
                throw new Error("Queried group does not exist.");
            return groupRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async addUser(id, group) {
        try {
            const userRecord = await this.userModel.findByIdAndUpdate(id, { $push: { group: { id: group, joined: new Date() } } }, { new: true });
            if (!userRecord)
                throw new Error("Queried user does not exist.");
            Reflect.deleteProperty(userRecord, 'password');
            Reflect.deleteProperty(userRecord, 'salt');
            return userRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async removeUser(id, group) {
        try {
            const userRecord = await this.userModel.findByIdAndUpdate(id, { $pull: { group: { id: group } } }, { new: true });
            if (!userRecord)
                throw new Error("Queried user does not exist.");
            Reflect.deleteProperty(userRecord, 'password');
            Reflect.deleteProperty(userRecord, 'salt');
            return userRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async permissionsManifest(user) {
        try {
            let clearManifest = {};
            await user.groups.map(async (group) => {
                await Object.keys(group.group.web_permissions).forEach((key, index) => {
                    if (group.group.web_permissions[key])
                        clearManifest[key] = group.group.web_permissions[key];
                });
            });
            return clearManifest;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
};
GroupService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('userModel')),
    __param(1, typedi_1.Inject('groupModel')),
    __param(2, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, Object, Object])
], GroupService);
exports.default = GroupService;
//# sourceMappingURL=groupService.js.map