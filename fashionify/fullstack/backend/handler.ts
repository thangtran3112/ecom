/** This handler is used only for AWS Lambda. If self-hosting the backend, this is not needed */
import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyHandler } from "aws-lambda";
import app from "./server";

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
  console.log(event);
  return serverlessExpress({ app })(event, context, callback);
};
