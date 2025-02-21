const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Message extends Model {
  static associate(models) {
    // A message belongs to a chat
    this.belongsTo(models.Chat, {
      foreignKey: "chat_id",
      as: "chat",
    });

    // A message belongs to a sender (user)
    this.belongsTo(models.User, {
      as: "sender",
      foreignKey: "sender_id",
    });
  }
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
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
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Message",
    tableName: "messages",
    timestamps: false,
  }
);

module.exports = Message;
