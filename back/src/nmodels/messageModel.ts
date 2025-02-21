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
  Default,
  BelongsTo,
  AutoIncrement,
} from "@sequelize/core/decorators-legacy";
import { Chat } from "./chatModel";
import { User } from "./userModel";

export class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare chat_id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare sender_id: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  declare message: string;

  @Attribute(DataTypes.ENUM("text", "image", "file"))
  @Default("text")
  declare type: string;

  @Attribute(DataTypes.ENUM("sent", "delivered", "read"))
  @Default("sent")
  declare status: string;

  @Attribute(DataTypes.JSONB)
  @Default({})
  declare metadata: object;

  @Attribute(DataTypes.DATE)
  declare read_at: Date;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare created_at: Date;

  @Attribute(DataTypes.DATE)
  declare deleted_at: Date;

  @BelongsTo(() => Chat, { foreignKey: "chat_id"})
  declare chat: Chat;

  @BelongsTo(() => User, { foreignKey: "sender_id" })
  declare sender: User;
}
