import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const { USER_POOL_ID: userPoolId, CLIENT_ID: clientId } = process.env;

export const handler = async (event) => {
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
