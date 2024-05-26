import { UserDao } from "../user/dao/user_dao";
import { InviteMongoose } from "../invite/dao/invite_mongoose";
import { InviteDao } from "../invite/dao/invite_dao";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { useCors } from "./use_cors";
import { ProgettoDao } from "../progetto/dao/progetto_dao";
import { ProgettoMongoose } from "../progetto/dao/progetto_mongoose";

export const acceptInvite = async (
  userDao: UserDao,
  userId: string,
  progettoDao: ProgettoDao,
  inviteDao: InviteDao,
  inviteId: string,
) => {
  const user = await userDao.findById(userId);
  const invite = await inviteDao.getInvite(inviteId);
  if (!invite) {
    return {
      statusCode: 400,
      body: "Invalid invite",
    };
  }
  await userDao.addToProject(user.Id, invite.projectId, invite.role);
  await progettoDao.addToProject(invite.projectId, user.Id);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await acceptInvite(
      new UserMongoose(mongoose),
      id,
      new ProgettoMongoose(mongoose),
      new InviteMongoose(mongoose),
      req.event.queryStringParameters.oinviteId,
    ),
  );
};
