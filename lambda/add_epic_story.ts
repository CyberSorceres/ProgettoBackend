import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role, User } from "../user/user";
import { EpicStory } from "../progetto/epic_story";
import { useCors } from "./use_cors";

interface AddEpicStoryRequest {
  description: string;
  projectId: string;
}

function validateBody(body: object): body is AddEpicStoryRequest {
  return "description" in body && "projectId" in body;
}

export const addEpicStory = async (
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
  if (role !== Role.PM) {
    return {
      statusCode: 501,
      body: "Unauthorized",
    };
  }

  const res = await progettoDao.insertEpicStory(
    body.projectId,
    new EpicStory(body.description, []),
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
  return useCors(await addEpicStory(
    new ProgettoMongoose(mongoose),
    new UserMongoose(mongoose),
    id,
    JSON.parse(req.body),
  ));
};
