/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { Duration, NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import {
  FunctionUrl,
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class LambdaUrlStack extends NestedStack {
  public readonly functionUrl: FunctionUrl;

  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    const functionConfiguration: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_LATEST,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      entry: path.join(__dirname, "../../../backend/handler.ts"),
      environment: {
        MONGO_URL:
          "mongodb+srv://hippo:hippo@awscluster1.yerzcf1.mongodb.net/admin-dashboard?retryWrites=true&w=majority",
      },
      bundling: {
        // minify: true,
        target: "es2022",
      },
    };
    this.functionUrl = this.initializeFunctionUrl(functionConfiguration, id);
  }

  /**
   *
   * @param functionConfiguration
   */
  private initializeFunctionUrl(
    functionConfiguration: NodejsFunctionProps,
    id: string
  ): FunctionUrl {
    const myFunction = new NodejsFunction(this, `FunctionUrl${id}`, {
      ...functionConfiguration,
      handler: "handler",
      description: "Proxy Function Url",
    });

    const myFunctionUrl = myFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE, //Could be IAM here
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [
          HttpMethod.GET,
          HttpMethod.PATCH,
          HttpMethod.PUT,
          HttpMethod.POST,
          HttpMethod.DELETE,
          HttpMethod.HEAD,
          HttpMethod.OPTIONS,
        ],
        allowedHeaders: ["*"],
        allowCredentials: true,
      },
    });

    return myFunctionUrl;
  }
}
