import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserDao } from "../user/dao/user_dao";
import { SESClient } from "@aws-sdk/client-ses";
import { UserMongoose } from "../user/dao/user_mongoose";
import { Mongoose } from "../database/mongoose";
import { Role, User } from "../user/user";
import { useCors } from "./use_cors";
import { v4 as uuidv4 } from "uuid";
import { getEmailCommand } from "../email/getEmailCommand";

interface InviteBody {
  projectId: string;
  role: number;
  email: string;
}

const { USER_POOL_ID: userPoolId } = process.env;

function validateBody(body: object): body is InviteBody {
  return "projectId" in body && "role" in body && "email" in body;
}

export const invite = async (
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
  const role = user.getRole();
  if (role !== Role.PM) {
    return {
      statusCode: 501,
      body: "Unauthorized",
    };
  }

  const cognito = new CognitoIdentityProviderClient();
  const params = {
    UserPoolId: userPoolId,
    Username: body.email as string,
    UserAttributes: [
      {
        Name: "email",
        Value: body.email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
    MessageAction: "SUPPRESS",
  };

  const res = await cognito.send(new AdminCreateUserCommand(params as any));

  const password = uuidv4();

  await cognito.send(
    new AdminSetUserPasswordCommand({
      Password: password,
      UserPoolId: userPoolId,
      Username: body.email,
      Permanent: false,
    }),
  );

  const sub = res.User.Attributes[2].Value;
  await userDao.insertUser(new User(sub, []));
  await userDao.addToProject(sub, body.projectId, body.role);
  const sesClient = new SESClient({ region: "eu-west-1" });
  try {
    await sesClient.send(getEmailCommand(body.email, password));
  } catch (e) {
    console.error(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, invite }),
  };
};

export const handler = async (req) => {
  const id = req.requestContext.authorizer.claims.sub;
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(
    await invite(new UserMongoose(mongoose), id, JSON.parse(req.body)),
  );
};
