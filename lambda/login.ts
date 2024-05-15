import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserDao } from "../user/dao/user_dao";
import { User } from "../user/user";
import { Mongoose } from "../database/mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";

const { USER_POOL_ID: userPoolId, CLIENT_ID: clientId } = process.env;

export const register = async (event, userDao: UserDao) => {
  try {
    const { email, password } = JSON.parse(event.body);
    const cognito = new CognitoIdentityProviderClient();
    const params = {
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      AuthParameters: {
        USERNAME: email as string,
        PASSWORD: password as string,
      },
    };

    const response = await cognito.send(
      new AdminInitiateAuthCommand(params as any),
    );

    userDao.insertUser(new User(response.AuthenticationResult.AccessToken));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: e }),
    };
  }
};

export const handler = async (event) => {
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return register(event, new UserMongoose(mongoose));
};
