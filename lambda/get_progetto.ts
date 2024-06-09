import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { useCors } from "./use_cors";

export const getProgetto = async (
  progettoDao: ProgettoDao,
  userDao: UserDao,
  userId: string,
  queryParams: object,
) => {
  if (!("projectId" in queryParams))
    return {
      statusCode: 400,
      body: "Invalid project id",
    };
  const progetto = await progettoDao.findById(queryParams.projectId);
  const user = await userDao.findById(userId);
  if (!user?.getRole() {
    return {
      statusCode: 504,
      body: "Unauthorized",
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(progetto),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await getProgetto(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      req.queryStringParameters,
    ),
  );
};
