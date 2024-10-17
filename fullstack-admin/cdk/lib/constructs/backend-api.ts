import { CfnOutput, Duration } from "aws-cdk-lib";
import { DockerImageCode, DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import {
  HttpApi,
  CorsHttpMethod,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs/lib";

export interface BackendApiProps {
  readonly corsAllowOrigins?: string[];
}

export class BackendApi extends Construct {
  readonly api: HttpApi;
  constructor(scope: Construct, id: string, props: BackendApiProps) {
    super(scope, id);

    const { corsAllowOrigins: allowOrigins = ["*"] } = props;

    const handler = new DockerImageFunction(this, "Handler", {
      code: DockerImageCode.fromImageAsset("../backend", {
        platform: Platform.LINUX_AMD64,
      }),
      memorySize: 512,
      timeout: Duration.seconds(30),
      environment: {
        MONGO_URL:
          "mongodb+srv://hippo:hippo@awscluster1.yerzcf1.mongodb.net/admin-dashboard?retryWrites=true&w=majority",
      },
    });

    const handlerPublic = new DockerImageFunction(this, `Handler${id}`, {
      code: DockerImageCode.fromImageAsset("../backend", {
        cmd: ["handler.handler"],
        platform: Platform.LINUX_AMD64,
      }),
      memorySize: 512,
      timeout: Duration.seconds(30),
      environment: {
        CORS_ALLOW_ORIGINS: allowOrigins.join(","),
      },
    });

    const api = new HttpApi(this, `HttpApi${id}`, {
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
        ],
        allowOrigins: allowOrigins,
        maxAge: Duration.days(10),
      },
    });

    {
      const integration = new HttpLambdaIntegration(
        `Integration${id}`,
        handler
      );

      api.addRoutes({
        path: "/{proxy+}",
        integration,
        methods: [
          HttpMethod.GET,
          HttpMethod.POST,
          HttpMethod.PUT,
          HttpMethod.DELETE,
        ],
      });
    }

    {
      const integration = new HttpLambdaIntegration(
        `PublicIntegration${id}`,
        handlerPublic
      );
      api.addRoutes({
        path: "/public/{proxy+}",
        integration,
        methods: [
          HttpMethod.GET,
          HttpMethod.POST,
          HttpMethod.PUT,
          HttpMethod.DELETE,
        ],
      });
    }

    this.api = api;

    new CfnOutput(this, "BackendApiUrl", { value: api.apiEndpoint });
  }
}
