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
      runtime: Runtime.NODEJS_22_X,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "handler.handler",
      code: Code.fromAsset(path.join(__dirname, "../../../backend/dist")),
      environment: {
        CORS_ALLOW_ORIGINS: allowOrigins.join(","),
        MONGODB_URI: process.env.MONGODB_URI as string,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY as string,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
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

    new CfnOutput(this, `${id}BackendApiUrl`, { value: api.apiEndpoint });
  }
}
