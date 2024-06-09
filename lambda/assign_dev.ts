import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { useCors } from "./use_cors";

interface AssignDevRequest {
  projectId: string;
  devId: string;
  userStoryId: string;
}

function validateBody(body: object): body is AssignDevRequest {
  return "projectId" in body && "devId" in body && "userStoryId" in body;
}

export const assignDev = async (
  progettoDao: ProgettoDao,
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
  const role = user.getRole();
  if (role !== Role.PM)
    return {
      statusCode: 504,
      body: "Unauthorized",
    };

  const success = await progettoDao.assignDev(
    body.projectId,
    body.userStoryId,
    body.devId,
  );
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
    await assignDev(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      JSON.parse(req.body),
    ),
  );
};
