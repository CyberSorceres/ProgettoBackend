import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";

interface GetEpicStoryRequest {
  projectId: string;
  epicStoryId: string;
}

function validateBody(body: object): body is GetEpicStoryRequest {
  return "projectId" in body && "epicStoryId" in body;
}

export const getEpicStory = async (
  progettoDao: ProgettoDao,
  userDao: UserDao,
  userId: string,
  body: object,
) => {
  const user = await userDao.findById(userId);

  if (!validateBody(body)) {
    return {
      statusCode: 400,
      body: "invalid body",
    };
  }
  if (!user.getProjectRole(body.projectId)) {
    return {
      statusCode: 504,
      body: "Unauthorized",
    };
  }
  const epicStories = await progettoDao.getEpicStory(
    body.projectId,
    body.epicStoryId,
  );
  return {
    statusCode: 200,
    body: JSON.stringify(epicStories),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return getEpicStory(
    new ProgettoMongoose(mongoose),
    new UserMongoose(mongoose),
    id,
    JSON.parse(req.body),
  );
};
