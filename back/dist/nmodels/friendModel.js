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
exports.Friend = void 0;
const core_1 = require("@sequelize/core");
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const userModel_1 = require("./userModel");
class Friend extends core_1.Model {
}
exports.Friend = Friend;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.PrimaryKey,
    __metadata("design:type", Object)
], Friend.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Friend.prototype, "userId", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], Friend.prototype, "friendId", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.ENUM("pending", "accepted", "rejected")),
    decorators_legacy_1.NotNull,
    (0, decorators_legacy_1.Default)("pending"),
    __metadata("design:type", Object)
], Friend.prototype, "status", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => userModel_1.User, { foreignKey: "userId" }),
    __metadata("design:type", Object)
], Friend.prototype, "user", void 0);
__decorate([
    (0, decorators_legacy_1.BelongsTo)(() => userModel_1.User, { foreignKey: "friendId" }),
    __metadata("design:type", Object)
], Friend.prototype, "friend", void 0);
