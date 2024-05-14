import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "todo-list",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    environment: {
      DB_URL: process.env.DB_URL ?? "",
      USER_POOL_ID: {
        Ref: "UserPool",
      },
      CLIENT_ID: {
        Ref: "UserClient",
      },
    },
  },
  functions: {
    getProgetti: {
      handler: "lambda/get_progetti.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getProgetti",
            cors: true,
          },
        },
      ],
    },
    login: {
      handler: "lambda/login.handler",
      events: [
        {
          http: {
            method: "post",
            path: "/login",
            cors: true,
          },
        },
      ],
    },
    register: {
      handler: "lambda/register.handler",
      events: [
        {
          http: {
            method: "post",
            path: "/register",
            cors: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      UserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "serverless-auth-pool",
          Schema: [
            {
              Name: "email",
              Required: true,
              Mutable: true,
            },
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
            },
          },
          AutoVerifiedAttributes: ["email"],
        },
      },
      UserClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "user-pool-ui",
          GenerateSecret: false,
          UserPoolId: {
            Ref: "UserPool",
          },
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH"],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
