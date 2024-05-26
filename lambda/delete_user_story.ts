import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { useCors } from "./use_cors";

interface DeleteUserStoryRequest {
  projectId: string;
  userStoryId: string;
}

function validateBody(body: object): body is DeleteUserStoryRequest {
  return "projectId" in body && "userStoryId" in body;
}

export const deleteUserStory = async (
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
  const role = user.getProjectRole(body.projectId);
  if (role !== Role.PM)
    return {
      statusCode: 504,
      body: "Unauthorized",
    };

  const success = await progettoDao.deleteUserStory(
    body.projectId,
    body.userStoryId,
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
    await deleteUserStory(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      JSON.parse(req.body),
    ),
  );
};
