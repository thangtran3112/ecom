#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GoLambdaStack } from '../lib/go-lambda-stack';

const app = new cdk.App();

new GoLambdaStack(app, 'GoLambdaStack', {
    /* If you want to specify env (account/region), uncomment and set:
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    */
});


