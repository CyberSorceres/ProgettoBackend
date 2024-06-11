import { NotificationMongoose } from "../notification/dao/notification_mongoose";
import { NotificationDao } from "../notification/dao/notification_dao";
import { Mongoose } from "../database/mongoose";
import { useCors } from "./use_cors";

export const getNotifications = async (
  notificationDao: NotificationDao,
  userId: string,
) => {
  return {
    statusCode: 200,
    body: JSON.stringify(await notificationDao.getNotificationsByUser(userId)),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await getNotifications(new NotificationMongoose(mongoose), id),
  );
};
