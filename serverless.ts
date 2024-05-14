import type { AWS } from "@serverless/typescript";

export const serverlessConfiguration: AWS = {
  service: "todo-list",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
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
  },
};
