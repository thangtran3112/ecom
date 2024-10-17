import { Stack, StackProps } from "aws-cdk-lib";
import { BackendApi } from "./constructs/backend-api";
import { Construct } from "constructs";

export class ServerlessWebappStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      description: "Serverless fullstack webapp stack",
      ...props,
    });

    const backend = new BackendApi(this, "AdminDashboardApi", {});
  }
}
