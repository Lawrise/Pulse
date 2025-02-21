import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  NotNull,
  HasMany,
} from "@sequelize/core/decorators-legacy";
import { Friend } from "./friendModel";
import { HasManyGetAssociationsMixin } from '@sequelize/core';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare username: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @HasMany(() => Friend, 'userId')
  declare friends?: Friend[];

  @HasMany(() => Friend, {
    foreignKey: 'userId', 
    scope: { status: 'pending'}, 
  })
  declare pendingFriends?: Friend[];

}
