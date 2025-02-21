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
  BelongsTo,
  NotNull,
  Default,
} from "@sequelize/core/decorators-legacy";
import { User } from "./userModel";

export class Friend extends Model<
  InferAttributes<Friend>,
  InferCreationAttributes<Friend>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare friendId: string;

  @Attribute(DataTypes.ENUM("pending", "accepted", "rejected"))
  @NotNull
  @Default("pending")
  declare status: CreationOptional<string>;

  @BelongsTo(() => User, { foreignKey: "userId"})
  declare user: User;

  @BelongsTo(() => User, { foreignKey: "friendId"})
  declare friend: User;
}
