import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { UserStory } from "../progetto/user_story";
import { useCors } from "./use_cors";

interface AddEpicStoryRequest {
  projectId: string;
  epicStoryId: number;
  tag: string;
  description: string;
}

function validateBody(body: object): body is AddEpicStoryRequest {
  return (
    "description" in body &&
    "projectId" in body &&
    "tag" in body &&
    "epicStoryId" in body
  );
}

export const addUserStory = async (
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
  if (role !== Role.PM && role !== Role.DEV) {
    return {
      statusCode: 501,
      body: "Unauthorized",
    };
  }

  const res = await progettoDao.insertUserStory(
    body.projectId,
    body.epicStoryId,
    new UserStory(body.tag, body.description),
  );
  if (!res) {
    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors( await addUserStory(
    new ProgettoMongoose(mongoose),
    new UserMongoose(mongoose),
    id,
    JSON.parse(req.body),
  ));
};
