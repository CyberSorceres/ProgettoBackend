import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Progetto } from "../progetto/progetto";
import { Role, User } from "../user/user";
import { useCors } from "./use_cors";

interface AddProgettoRequest {
  name: string;
  ai: string;
  cliente: string;
}

function validateBody(body: object): body is AddProgettoRequest {
  return "name" in body && "ai" in body && "cliente" in body;
}

export const addProgetto = async (
  progettoDao: ProgettoDao,
  userDao: UserDao,
  userId: string,
  body: object,
) => {
  const user = await userDao.findById(userId);
  if (!user) {
    await userDao.insertUser(new User(userId));
  }
  const isValid = validateBody(body);
  if (!isValid)
    return {
      statusCode: 400,
      body: "invalid body",
    };

  const id = await progettoDao.insertProgetto(
    new Progetto(body.name, body.cliente, false, [], undefined, body.ai),
  );
  await userDao.addToProject(userId, id, Role.PM);
  await progettoDao.addToProject(id, userId);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, projectId: id }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await addProgetto(
      new ProgettoMongoose(mongoose),
      new UserMongoose(mongoose),
      id,
      JSON.parse(req.body),
    ),
  );
};
