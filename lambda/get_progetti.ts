import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";
import { Mongoose } from "../database/mongoose";

export const getProgetti = async (progettoDao: ProgettoDao) => {
  return {
    statusCode: 200,
    body: JSON.stringify(await progettoDao.findAll()),
  };
};

export default async () => {
  const mongoose = await Mongoose.create("todo");
  return getProgetti(new ProgettoMongoose(mongoose));
};
