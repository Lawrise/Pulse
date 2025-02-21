import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import { User } from "./userModel";
import { Message } from "./messageModel";
import sequelize  from "../config/db";

interface ChatAttributes {
  id: string;
  user1_id: string;
  user2_id: string;
  name?: string;
  is_active: boolean;
  last_message_at?: Date;
  created_at: Date;
  deleted_at?: Date;
  // associations
  user1?: User;
  user2?: User;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, 'id' | 'is_active' | 'created_at'> {}

export class Chat extends Model<ChatAttributes, ChatCreationAttributes> {
  declare id: string;
  declare user1_id: string;
  declare user2_id: string;
  declare name?: string;
  declare is_active: boolean;
  declare last_message_at?: Date;
  declare created_at: Date;
  declare deleted_at?: Date;

  /* Associations
  declare user1?: User;
  declare user2?: User;
  declare messages?: Message[];

  static associate(models: any) {
    Chat.belongsTo(models.User, { as: 'user1', foreignKey: 'user1_id' });
    Chat.belongsTo(models.User, { as: 'user2', foreignKey: 'user2_id' });
    Chat.hasMany(models.Message, { foreignKey: 'chat_id' });
  }*/
}

Chat.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user1_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_message_at: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: "chat",
  timestamps: false,
});

/*
// Define associations
Chat.associate = (models: any) => {
  Chat.belongsTo(models.User, { as: "user1", foreignKey: "user1_id" });
  Chat.belongsTo(models.User, { as: "user2", foreignKey: "user2_id" });
  Chat.hasMany(models.Message, { foreignKey: "chat_id" });
};*/

export default Chat;
