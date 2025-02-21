const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

// models/chat.js

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true, // For potential future group chat support
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_message_at: {
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
    tableName: "chats",
    timestamps: false,
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["user1_id", "user2_id"],
    //   },
    // ],
  }
);

Chat.associate = (models) => {
  // A chat belongs to two users (user1 and user2)
  Chat.belongsTo(models.User, {
    as: "user1",
    foreignKey: "user1_id",
  });
  Chat.belongsTo(models.User, {
    as: "user2",
    foreignKey: "user2_id",
  });

  // A chat can have many messages
  Chat.hasMany(models.Message, {
    foreignKey: "chat_id",
    as: "messages",
  });
};


// models/user.js (for reference)
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    // User model definition...
  });

  User.associate = (models) => {
    // User can be user1 in many chats
    User.hasMany(models.Chat, {
      foreignKey: "user1_id",
      as: "chatsAsUser1",
    });

    // User can be user2 in many chats
    User.hasMany(models.Chat, {
      foreignKey: "user2_id",
      as: "chatsAsUser2",
    });

    // User can have many messages
    User.hasMany(models.Message, {
      foreignKey: "sender_id",
      as: "messages",
    });
  };

  return User;
};
