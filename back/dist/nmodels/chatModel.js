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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const core_1 = require("@sequelize/core");
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const userModel_1 = require("./userModel");
const messageModel_1 = require("./messageModel");
let Chat = class Chat extends core_1.Model {
};
exports.Chat = Chat;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.PrimaryKey,
    __metadata("design:type", Object)
], Chat.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Chat.prototype, "user1_id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Chat.prototype, "user2_id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.STRING),
    __metadata("design:type", Object)
], Chat.prototype, "name", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.BOOLEAN),
    (0, decorators_legacy_1.Default)(true),
    __metadata("design:type", Object)
], Chat.prototype, "is_active", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    __metadata("design:type", Object)
], Chat.prototype, "last_message_at", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    (0, decorators_legacy_1.Default)(core_1.DataTypes.NOW),
    __metadata("design:type", Object)
], Chat.prototype, "created_at", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    __metadata("design:type", Object)
], Chat.prototype, "deleted_at", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => userModel_1.User, { foreignKey: "user1_id" }),
    __metadata("design:type", Object)
], Chat.prototype, "user1", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => userModel_1.User, { foreignKey: "user2_id" }),
    __metadata("design:type", Object)
], Chat.prototype, "user2", void 0);
__decorate([
    (0, decorators_legacy_1.HasMany)(() => messageModel_1.Message, { foreignKey: "chat_id" }),
    __metadata("design:type", Object)
], Chat.prototype, "messages", void 0);
exports.Chat = Chat = __decorate([
    decorators_legacy_1.Table
], Chat);
