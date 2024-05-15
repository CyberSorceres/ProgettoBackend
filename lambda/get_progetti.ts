import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { UserDao } from "../user/dao/user_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";

export const getProgetti = async (
  progettoDao: ProgettoDao,
  userDao: UserDao,
  userId: string,
) => {
  const progetti = await progettoDao.findAll();
  const user = await userDao.findById(userId);
  return {
    statusCode: 200,
    body: JSON.stringify({
      celebrale: progetti.filter((p) => user.getProjectRole(p.Id)),
      razionale: user,
    }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return getProgetti(
    new ProgettoMongoose(mongoose),
    new UserMongoose(mongoose),
    id,
  );
};
