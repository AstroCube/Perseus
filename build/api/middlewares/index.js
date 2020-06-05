"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAttachment_1 = __importDefault(require("./userAttachment"));
const authentication_1 = __importDefault(require("./authentication"));
const permissions_1 = __importDefault(require("./permissions"));
const cluster_1 = __importDefault(require("./cluster"));
const serverAttachment_1 = __importDefault(require("./serverAttachment"));
exports.default = {
    authentication: authentication_1.default,
    userAttachment: userAttachment_1.default,
    serverAttachment: serverAttachment_1.default,
    cluster: cluster_1.default,
    permissions: permissions_1.default
};
//# sourceMappingURL=index.js.map