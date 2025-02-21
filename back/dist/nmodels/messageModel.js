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
exports.Message = void 0;
const core_1 = require("@sequelize/core");
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const chatModel_1 = require("./chatModel");
const userModel_1 = require("./userModel");
class Message extends core_1.Model {
}
exports.Message = Message;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.PrimaryKey,
    __metadata("design:type", Object)
], Message.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Message.prototype, "chat_id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Message.prototype, "sender_id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.TEXT),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.ENUM("text", "image", "file")),
    (0, decorators_legacy_1.Default)("text"),
    __metadata("design:type", String)
], Message.prototype, "type", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.ENUM("sent", "delivered", "read")),
    (0, decorators_legacy_1.Default)("sent"),
    __metadata("design:type", String)
], Message.prototype, "status", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.JSONB),
    (0, decorators_legacy_1.Default)({}),
    __metadata("design:type", Object)
], Message.prototype, "metadata", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    __metadata("design:type", Date)
], Message.prototype, "read_at", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    (0, decorators_legacy_1.Default)(core_1.DataTypes.NOW),
    __metadata("design:type", Date)
], Message.prototype, "created_at", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.DATE),
    __metadata("design:type", Date)
], Message.prototype, "deleted_at", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => chatModel_1.Chat, { foreignKey: "chat_id" }),
    __metadata("design:type", chatModel_1.Chat)
], Message.prototype, "chat", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => userModel_1.User, { foreignKey: "sender_id" }),
    __metadata("design:type", userModel_1.User)
], Message.prototype, "sender", void 0);
