import { UserDao } from "./user_dao";
import { Role, User } from "../user";
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
      new Schema({
        id: String,
        projects: [String],
      }).loadClass(User),
    );
  }
  async findById(id: any): Promise<User> {
    const user = await this.UserModel.findOne({ id });
    if (!user) return null;
    return new User(user.id, user.projects);
  }
  async insertUser(user: User): Promise<boolean> {
    try {
      if (!(await this.findById(user.Id))) {
        await new this.UserModel(user).save();
      }
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
  async addToProject(
    userId: any,
    projectId: string,
    role: Role,
  ): Promise<boolean> {
    await this.UserModel.findOneAndUpdate(
      { id: userId },
      {
        $push: {
          projectId,
        },
      },
    );
    return true;
  }
}
