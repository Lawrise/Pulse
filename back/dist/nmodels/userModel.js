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
exports.User = void 0;
const core_1 = require("@sequelize/core");
const decorators_legacy_1 = require("@sequelize/core/decorators-legacy");
const friendModel_1 = require("./friendModel");
class User extends core_1.Model {
}
exports.User = User;
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.UUID),
    decorators_legacy_1.PrimaryKey,
    __metadata("design:type", Object)
], User.prototype, "id", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.STRING),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.STRING),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, decorators_legacy_1.Attribute)(core_1.DataTypes.STRING),
    decorators_legacy_1.NotNull,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, decorators_legacy_1.HasMany)(() => friendModel_1.Friend, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, decorators_legacy_1.HasMany)(() => friendModel_1.Friend, {
        foreignKey: 'userId',
        scope: { status: 'pending' },
    }),
    __metadata("design:type", Array)
], User.prototype, "pendingFriends", void 0);
