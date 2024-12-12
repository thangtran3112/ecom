import { LambdaUrlStack } from "./constructs/lambda-url";
import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { BackendApi } from "./constructs/backend-api";
import { Construct } from "constructs";
import { Frontend } from "./constructs/frontend";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";

import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export class ServerlessWebappStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      description: "Serverless fullstack webapp stack",
      ...props,
    });

    const frontEndaccessLogBucket = new Bucket(
      this,
      `${id}FrontendAccessLogs`,
      {
        encryption: BucketEncryption.S3_MANAGED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        removalPolicy: RemovalPolicy.DESTROY,
        objectOwnership: ObjectOwnership.OBJECT_WRITER,
        autoDeleteObjects: true,
      }
    );

    const backend = new BackendApi(this, `${id}BackendApi`, {});
    // const lambdaUrlApi = new LambdaUrlStack(this, "AdminDashboard");
    const frontend = new Frontend(this, `${id}Frontend`, {
      backendApi: backend.api,
      accessLogBucket: frontEndaccessLogBucket,
    });
    new CfnOutput(this, `${id}FrontendDomainName`, {
      value: `https://${frontend.cloudFrontWebDistribution.distributionDomainName}`,
    });
  }
}
