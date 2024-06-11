import {
  CognitoIdentityProviderClient,
  AdminRespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useCors } from "./use_cors";

const { USER_POOL_ID: userPoolId, CLIENT_ID: clientId } = process.env;

export const handler = async (req) => {
  try {
    const { password, session, email } = JSON.parse(req.body);
    const cognito = new CognitoIdentityProviderClient();

    const response = await cognito.send(
      new AdminRespondToAuthChallengeCommand({
        Session: session,
        ChallengeResponses: {
          NEW_PASSWORD: password,
          USERNAME: email,
        },
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ClientId: clientId,
        UserPoolId: userPoolId,
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
