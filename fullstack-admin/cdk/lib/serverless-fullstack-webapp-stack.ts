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

export class ServerlessWebappStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      description: "Serverless fullstack webapp stack",
      ...props,
    });

    const accessLogBucket = new Bucket(this, "AdminDashboardAccessLog", {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      autoDeleteObjects: true,
    });

    const backend = new BackendApi(this, "AdminDashboardApi", {});
    // const lambdaUrlApi = new LambdaUrlStack(this, "AdminDashboard");
    const frontend = new Frontend(this, "AdminDashboardFrontEnd", {
      backendApi: backend.api,
      accessLogBucket,
    });
    new CfnOutput(this, "FrontendDomainName", {
      value: `https://${frontend.cloudFrontWebDistribution.distributionDomainName}`,
    });
  }
}
