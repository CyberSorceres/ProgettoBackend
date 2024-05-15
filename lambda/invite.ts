import { UserDao } from "../user/dao/user_dao";
import { InviteMongoose } from "../invite/dao/invite_mongoose";
import { InviteDao } from "../invite/dao/invite_dao";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role } from "../user/user";
import { v4 as uuidv4 } from "uuid";

interface InviteBody {
  projectId: string;
  role: number;
}

function validateBody(body: object): body is InviteBody {
  return "projectId" in body && "role" in body;
}

export const invite = async (
  userDao: UserDao,
  userId: string,
  inviteDao: InviteDao,
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

  const invite = {
    id: uuidv4(),
    projectId: body.projectId,
    role: body.role,
  };
  if (!(await inviteDao.insertInvite(invite))) {
    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, invite }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return invite(
    new UserMongoose(mongoose),
    id,
    new InviteMongoose(mongoose),
    JSON.parse(req.body),
  );
};
