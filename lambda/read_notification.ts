import { NotificationMongoose } from "../notification/dao/notification_mongoose";
import { NotificationDao } from "../notification/dao/notification_dao";
import { Mongoose } from "../database/mongoose";
import { useCors } from "./use_cors";

export const readNotifications = async (
  notificationDao: NotificationDao,
  userId: string,
  notification_id: string,
) => {
  const notificationUser = await notificationDao.getNotificationsByUser(userId);
  const verifica = notificationUser.some((n) => n._id == notification_id);
  if (verifica) {
    await notificationDao.setRead(notification_id);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(verifica),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await readNotifications(new NotificationMongoose(mongoose), id, req.body),
  );
};
