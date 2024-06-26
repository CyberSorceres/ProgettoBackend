import type { AWS } from "@serverless/typescript";
import { readNotifications } from "./lambda/read_notification";

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
      OPENAI_ORG_ID: process.env.OPENAI_ORG_ID ?? "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      USER_POOL_ID: {
        Ref: "UserPool",
      },
      CLIENT_ID: {
        Ref: "UserClient",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "bedrock:InvokeModel",
              "ses:SendEmail",
              "cognito-idp:AdminInitiateAuth",
              "cognito-idp:AdminCreateUser",
              "cognito-idp:AdminSetUserPassword",
              "cognito-idp:AdminRespondToAuthChallenge",
            ],
            Resource: "*",
          },
        ],
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
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getProgetto: {
      handler: "lambda/get_progetto.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getProgetto",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getProgettoByTag: {
      handler: "lambda/get_progetto_by_tag.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getProgettoByTag",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getEpicStory: {
      handler: "lambda/get_epic_story.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getEpicStory",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getUserStory: {
      handler: "lambda/get_user_story.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getUserStory",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getUserStoryByTag: {
      handler: "lambda/get_user_story_by_tag.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/getUserStoryByTag",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getAssignedUserStory: {
      handler: "lambda/get_assigned_user_story.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/get_assigned_user_story",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    addProgetto: {
      handler: "lambda/add_progetto.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/add_progetto",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    addEpicStory: {
      handler: "lambda/add_epic_story.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/add_epic_story",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    addUserStory: {
      handler: "lambda/add_user_story.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/add_user_story",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    acceptInvite: {
      handler: "lambda/accept_invite.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/accept_invite",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    invite: {
      handler: "lambda/invite.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/invite",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    assignDev: {
      handler: "lambda/assign_dev.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/assign_dev",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    businessRequirements: {
      handler: "lambda/business_requirements.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/business_requirements",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    setUnitTest: {
      handler: "lambda/set_unit_test.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/set_unit_test",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    setUserStoryState: {
      handler: "lambda/set_user_story_state.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/set_user_story_state",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },

    readNotifications: {
      handler: "lambda/read_notification.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/read_notification",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    insertFeedback: {
      handler: "lambda/insert_feedback.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/insert_feedback",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    getNotifications: {
      handler: "lambda/get_notifications.handler",
      events: [
        {
          http: {
            method: "GET",
            path: "/notifications",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
          },
        },
      ],
    },
    changePassword: {
      handler: "lambda/change_password.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "/change_password",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
          },
        },
      ],
    },
    bedrock: {
      handler: "lambda/ai.handleBedrock",
      timeout: 30,
      events: [
        {
          http: {
            method: "GET",
            path: "/bedrock",
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
          },
        },
      ],
    },
    chatGPT: {
      handler: "lambda/ai.handleChatGPT",
      events: [
        {
          http: {
            method: "GET",
            path: "/chatgpt",
            cors: true,
            authorizer: {
              name: "PrivateAuthorizer",
              type: "COGNITO_USER_POOLS",
              arn: {
                "Fn::GetAtt": ["UserPool", "Arn"],
              },
              claims: ["email"],
            },
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
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
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
            cors: {
              allowCredentials: true,
              origin: "http://localhost:5173",
            },
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
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
