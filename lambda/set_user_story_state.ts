import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { useCors } from "./use_cors";

interface SetPassingRequest {
  projectId: string;
  userStoryId: string;
  state: number;
}

function validateBody(body: object): body is SetPassingRequest {
  return "projectId" in body && "userStoryId" in body && "state" in body;
}

export const setPassing = async (
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
  if (role !== Role.PM && role !== Role.DEV)
    return {
      statusCode: 504,
      body: "Unauthorized",
    };

  const success = await progettoDao.setUserStoryState(
    body.projectId,
    body.userStoryId,
    body.state,
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
    await setPassing(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      JSON.parse(req.body),
    ),
  );
};
