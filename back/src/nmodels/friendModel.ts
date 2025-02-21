import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./userModel";

export interface FriendAttributes {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted" | "rejected";
  user?: User;
  friendUser?: User;
}

export interface FriendCreationAttributes
  extends Optional<FriendAttributes, "id" | "status"> {}

export class Friend extends Model<FriendAttributes, FriendCreationAttributes> {
  declare id: string;
  declare userId: string;
  declare friendId: string;
  declare status: "pending" | "accepted" | "rejected";
  declare user?: User;
  declare friend?: User;
}

Friend.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    friendId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "friend",
    timestamps: false,
  }
);

export default Friend;
