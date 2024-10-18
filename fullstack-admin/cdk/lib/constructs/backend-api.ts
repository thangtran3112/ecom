import { CfnOutput, Duration } from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  HttpApi,
  CorsHttpMethod,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs/lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import path = require("path");

export interface BackendApiProps {
  readonly corsAllowOrigins?: string[];
}

export class BackendApi extends Construct {
  readonly api: HttpApi;
  constructor(scope: Construct, id: string, props: BackendApiProps) {
    super(scope, id);

    const { corsAllowOrigins: allowOrigins = ["*"] } = props;

    const api = new HttpApi(this, `HttpApi${id}`, {
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
        ],
        allowOrigins: allowOrigins,
        maxAge: Duration.days(10),
      },
    });

    const lambdaFunction = new Function(this, `NonDockerHandler${id}`, {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "handler.handler",
      code: Code.fromAsset(path.join(__dirname, "../../../backend/dist")),
      environment: {
        CORS_ALLOW_ORIGINS: allowOrigins.join(","),
        MONGO_URL:
          "mongodb+srv://hippo:hippo@awscluster1.yerzcf1.mongodb.net/admin-dashboard?retryWrites=true&w=majority",
      },
    });

    const nonDockerIntegration = new HttpLambdaIntegration(
      `NonDockerInteg${id}`,
      lambdaFunction
    );
    api.addRoutes({
      path: "/{proxy+}",
      integration: nonDockerIntegration,
      methods: [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.PUT,
        HttpMethod.DELETE,
        HttpMethod.PATCH,
      ],
    });

    this.api = api;

    new CfnOutput(this, "BackendApiUrl", { value: api.apiEndpoint });
  }
}
