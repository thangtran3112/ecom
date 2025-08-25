import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { DockerImage } from 'aws-cdk-lib';
import { execSync } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';

export class GoLambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const projectRoot = path.join(__dirname, '../../');
        dotenv.config({ path: path.join(projectRoot, '.env') });

        const fn = new lambda.Function(this, 'GoLambda', {
            runtime: lambda.Runtime.PROVIDED_AL2023,
            handler: 'bootstrap', // without a container image, the lambda always look for /var/task/bootstrap (or /opt/bootstrap via a layer) 
            architecture: lambda.Architecture.X86_64,
            timeout: cdk.Duration.seconds(30),
            memorySize: 512,
            code: lambda.Code.fromAsset(projectRoot, {
                bundling: {
                    local: {
                        tryBundle: (outputDir: string) => {
                            try {
                                execSync(
                                    `GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ${outputDir}/bootstrap ./lambda`,
                                    { stdio: 'inherit', cwd: projectRoot }
                                );
                                return true;
                            } catch (_) {
                                return false;
                            }
                        }
                    },
                    image: DockerImage.fromRegistry('golang:1.24'),
                    user: 'root',
                    command: [
                        'bash', '-lc',
                        [
                            'set -euo pipefail',
                            'GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o /asset-output/bootstrap ./lambda',
                        ].join(' && '),
                    ],
                    workingDirectory: '/asset-input',
                },
                exclude: [
                    '@cdk',
                    'tmp',
                    '.git',
                    'postman',
                    'DatabaseDesign.png',
                    'MultiSellerDesign.png'
                ],
            }),
            environment: {
                SERVER_PORT: process.env.SERVER_PORT || ':8080',
                DB_HOST: process.env.DB_HOST || '',
                DB_USER: process.env.DB_USER || '',
                DB_PASSWORD: process.env.DB_PASSWORD || '',
                DB_NAME: process.env.DB_NAME || '',
                DB_PORT: process.env.DB_PORT || '5432',
                APP_SECRET: process.env.APP_SECRET || '',
                TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
                TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
                TWILIO_FROM_PHONE_NUMBER: process.env.TWILIO_FROM_PHONE_NUMBER || '',
                STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
                PUB_KEY: process.env.PUB_KEY || '',
                APP_ENV: 'lambda'
            }
        });

        // Replace API Gateway with a Lambda Function URL (cheaper)
        const fnUrl = fn.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
                allowedMethods: [
                    lambda.HttpMethod.GET,
                    lambda.HttpMethod.POST,
                    lambda.HttpMethod.PUT,
                    lambda.HttpMethod.PATCH,
                    lambda.HttpMethod.DELETE,
                    lambda.HttpMethod.HEAD,
                ],
            },
        });

        new cdk.CfnOutput(this, 'LambdaFunctionUrl', { value: fnUrl.url });
    }
}


