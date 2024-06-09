import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { NotificationDao } from "../notification/dao/notification_dao";
import { NotificationMongoose } from "../notification/dao/notification_mongoose";
import { NotificationType } from "../notification/notification";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { useCors } from "./use_cors";

interface BusinessRequiremenetsRequest {
  projectId: string;
  businessRequirements: string;
}

function validateBody(body: object): body is BusinessRequiremenetsRequest {
  return "businessRequirements" in body;
}

export const businessRequirements = async (
  notificationDao: NotificationDao,
  userDao: UserDao,
  userId: string,
  body: object,
) => {
  const user = await userDao.findById(userId);
  const isValid = validateBody(body);
  if (!isValid)
    return {
      statusCode: 400,
      body: "invalid body",
    };
  //const role = user.getProjectRole(body.projectId);
  /*    if (role !== Role.USER)
    return {
      statusCode: 504,
      body: "Unauthorized",
    };*/
  const success = await notificationDao.insertNotification({
    userId,
    title: "Business Requirements",
    message: body.businessRequirements,
    read: false,
    type: NotificationType.BUSINESS,
  });

  if (success) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } else {
    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await businessRequirements(
      new NotificationMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      JSON.parse(req.body),
    ),
  );
};
