import { NotificationDao } from "./notification_dao";
import { Notification } from "../notification";
import { Mongoose } from "../../database/mongoose";
import { Model } from "mongoose";
import { Schema } from "mongoose";

export class NotificationMongoose implements NotificationDao {
  private mongoose: Mongoose;
  private NotificationModel: Model<Notification & { _id: string }>;

  constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.NotificationModel = this.mongoose.connection.model<
      Notification & { _id: string }
    >(
      "Model",
      new Schema({
        _id: String,
        userId: String,
        message: String,
      }),
    );
  }
  async insertNotification(notification: Notification): Promise<boolean> {
    await new this.NotificationModel(notification).save();
    return true;
  }
  async removeNotification(id: string): Promise<boolean> {
    this.NotificationModel.findOneAndDelete({ _id: id });
    return true;
  }
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.NotificationModel.find({ userId }).exec();
  }
}
