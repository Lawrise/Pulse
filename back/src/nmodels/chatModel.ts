import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey as FK,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  NotNull,
  HasMany,
  BelongsTo,
  Default,
  AutoIncrement,
  Table,
} from "@sequelize/core/decorators-legacy";
import { User } from "./userModel";
import { Message } from "./messageModel";

@Table
export class Chat extends Model<
  InferAttributes<Chat>,
  InferCreationAttributes<Chat>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare user1_id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare user2_id: string;

  @Attribute(DataTypes.STRING)
  declare name: CreationOptional<string>;

  @Attribute(DataTypes.BOOLEAN)
  @Default(true)
  declare is_active: CreationOptional<boolean>;

  @Attribute(DataTypes.DATE)
  declare last_message_at: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare created_at: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  declare deleted_at: CreationOptional<Date>;

  @BelongsTo(() => User, { foreignKey: "user1_id" })
  declare user1: CreationOptional<User>;

  @BelongsTo(() => User, { foreignKey: "user2_id" })
  declare user2: CreationOptional<User>;

  @HasMany(() => Message, { foreignKey: "chat_id" })
  declare messages: CreationOptional<Message[]>;
}
