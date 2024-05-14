import { UserDao } from "./user_dao";
import { User } from "../user";
import { Mongoose } from "../../database/mongoose";
import { Schema } from "mongoose";
import { Model } from "mongoose";

export class UserMongoose implements UserDao {
  private mongoose: Mongoose;
  private UserModel: Model<User, any, any>;
  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.UserModel = this.mongoose.connection.model<User>(
      "User",
      new Schema().loadClass(User),
    );
  }
  async findById(id: any): Promise<User> {
    const user = await this.UserModel.findOne({ id });
    return new User(user.id);
  }
  async insertUser(user: User): Promise<boolean> {
    try {
      const a = await this.UserModel.findOne({ id: 1 });

      await new this.UserModel(user).save();
      return true;
    } catch (e) {
      return false;
    }
  }
  updateUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteUser(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
