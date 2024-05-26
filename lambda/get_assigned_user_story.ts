import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { Mongoose } from "../database/mongoose";
import { useCors } from "./use_cors";

export const getAssignedUserStory = async (
  progettoDao: ProgettoDao,
  userId: string,
) => {
  const res = await progettoDao.getUserStoryByUser(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await getAssignedUserStory(new ProgettoMongoose(mongoose), id),
  );
};
