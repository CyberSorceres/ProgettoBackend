import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { UserDao } from "../user/dao/user_dao";
import { User } from "../user/user";
import { Mongoose } from "../database/mongoose";
import { UserMongoose } from "../user/dao/user_mongoose";
import { jwtDecode } from "jwt-decode";
import { useCors } from "./use_cors";

const { USER_POOL_ID: userPoolId, CLIENT_ID: clientId } = process.env;

export const register = async (event, userDao: UserDao) => {
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
  if (response?.AuthenticationResult?.IdToken) {
    await userDao.insertUser(
      new User(jwtDecode(response.AuthenticationResult.IdToken).sub),
    );
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(response),
  };
};

export const handler = async (event) => {
  const mongoose = await Mongoose.create(process.env.DB_URL);
  return useCors(await register(event, new UserMongoose(mongoose)));
};
