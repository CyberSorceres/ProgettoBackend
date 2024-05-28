import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useCors } from "./use_cors";

const { USER_POOL_ID: userPoolId } = process.env;

export const handler = async (req) => {
  try {
    const email = req.requestContext.authorizer.claims.email;
    const { password } = JSON.parse(req.body);
    const cognito = new CognitoIdentityProviderClient();
    const response = await cognito.send(
      new AdminSetUserPasswordCommand({
        Password: password,
        UserPoolId: userPoolId,
        Username: email,
        Permanent: true,
      }),
    );

    return useCors({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(response),
    });
  } catch (e) {
    return useCors({
      statusCode: 500,
      body: JSON.stringify(e),
    });
  }
};
