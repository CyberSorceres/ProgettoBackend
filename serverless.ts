import type { AWS } from "@serverless/typescript";

console.log(process.env.DB_URL);

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
  },
};

module.exports = serverlessConfiguration;
