import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";
import { Chat } from "./chatModel";
import { User } from "./userModel";

interface MessageAttributes {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  type: string;
  status: string;
  metadata: object;
  read_at?: Date;
  created_at: Date;
  deleted_at?: Date;
}

interface MessageCreationAttributes
  extends Optional<
    MessageAttributes,
    "id" | "type" | "status" | "metadata" | "created_at"
  > {}

export class Message extends Model<
  MessageAttributes,
  MessageCreationAttributes
> {
  declare id: string;
  declare chat_id: string;
  declare sender_id: string;
  declare message: string;
  declare type: string;
  declare status: string;
  declare metadata: object;
  declare read_at?: Date;
  declare created_at: Date;
  declare deleted_at?: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    chat_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "image", "file"),
      defaultValue: "text",
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "read"),
      defaultValue: "sent",
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    read_at: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "message",
    timestamps: false,
  }
);

export default Message;
