import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { useCors } from "./use_cors";

interface GetUserStoryRequest {
  projectId: string;
  userStoryId: string;
}

function validateBody(body: object): body is GetUserStoryRequest {
  return "projectId" in body && "userStoryId" in body;
}

export const getUserStory = async (
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
  if (!user.getRole() {
    return {
      statusCode: 504,
      body: "Unauthorized",
    };
  }
  const userStories = await progettoDao.getUserStory(
    body.projectId,
    body.userStoryId,
  );
  return {
    statusCode: 200,
    body: JSON.stringify(userStories),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await getUserStory(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      req.queryStringParameters,
    ),
  );
};
