import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

interface BraidMiddlewareStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  dbSecurityGroup: ec2.SecurityGroup;
  braidMiddlewareSecret: secretsmanager.ISecret;
}

export class BraidMiddlewareStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BraidMiddlewareStackProps) {
    super(scope, id, props);

    const { braidMiddlewareSecret, vpc, dbSecurityGroup } = props;
    const ipWhitelist = process.env.IP_WHITELIST;
    const allowedIps = ipWhitelist?.split(",") || [];

    const jwtAuthorizer = new lambdaNodejs.NodejsFunction(
      this,
      "JWTAuthorizerFn",
      {
        entry: "./functions/jwt-authorizer/index.ts",
        handler: "jwtAuthorizerHandler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(10),
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(jwtAuthorizer);

    const authorizer = new apigateway.RequestAuthorizer(this, "JWTAuthorizer", {
      handler: jwtAuthorizer,
      authorizerName: "jwtRequestAuthorizer",
      identitySources: [
        apigateway.IdentitySource.header("Authorization"),
        apigateway.IdentitySource.header("X-User-Id"),
      ],
      resultsCacheTtl: cdk.Duration.seconds(0),
    });

    // Get Uncleaned Transactions
    const getUncleanedTransactions = new lambdaNodejs.NodejsFunction(
      this,
      "GetUncleanedTransactions",
      {
        entry: "./functions/get-uncleaned-transactions/index.ts",
        handler: "getUncleanedTransactionsHandler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(10),
        memorySize: 512,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          STAGE: process.env.STAGE ?? "sandbox",
          BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(getUncleanedTransactions);

    // Update Transaction
    const updateTransaction = new lambdaNodejs.NodejsFunction(
      this,
      "UpdateTransaction",
      {
        entry: "./functions/update-transaction/index.ts",
        handler: "updateTransactionHandler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(10),
        memorySize: 512,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          STAGE: process.env.STAGE ?? "sandbox",
          BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(updateTransaction);

    // Sync products and programs
    const syncProductsAndPrograms = new lambdaNodejs.NodejsFunction(
      this,
      "SyncProductsAndPrograms",
      {
        entry: "./functions/sync-products-and-programs/index.ts",
        handler: "syncProductsAndPrograms",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(10),
        memorySize: 512,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          STAGE: process.env.STAGE ?? "sandbox",
          BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(syncProductsAndPrograms);

    // Sync customers and counterparties
    const syncCustomersAndCounterparties = new lambdaNodejs.NodejsFunction(
      this,
      "SyncCustomersAndCounterparties",
      {
        entry: "./functions/sync-customers-and-counterparties/index.ts",
        handler: "syncCustomersAndCounterpartiesHandler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          STAGE: process.env.STAGE ?? "sandbox",
          BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(syncCustomersAndCounterparties);

    // Sync Braid Transactions (Go Lambda)
    const syncTransactions = new lambdaGo.GoFunction(this, "SyncTransactions", {
      entry: "./functions/sync-braid-transactions",
      runtime: lambda.Runtime.PROVIDED_AL2,
      timeout: cdk.Duration.seconds(30),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      memorySize: 512,
      environment: {
        STAGE: process.env.STAGE ?? "sandbox",
        BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
        BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
      },
    });

    braidMiddlewareSecret.grantRead(syncTransactions);

    // Mark transaction as clean
    const markTransactionAsClean = new lambdaNodejs.NodejsFunction(
      this,
      "MarkTransactionAsClean",
      {
        entry: "./functions/mark-transaction-as-clean/index.ts",
        handler: "markTransactionAsCleanHandler",
        runtime: lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
        vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [dbSecurityGroup],
        environment: {
          STAGE: process.env.STAGE ?? "sandbox",
          BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
          BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
        },
      }
    );

    braidMiddlewareSecret.grantRead(markTransactionAsClean);

    // Health Check
    const healthCheck = new lambdaNodejs.NodejsFunction(this, "HealthCheck", {
      entry: "./functions/health-check/index.ts",
      handler: "healthCheckHandler",
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 512,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      environment: {
        STAGE: process.env.STAGE ?? "sandbox",
        BRAID_API_BASE_URL: process.env.BRAID_API_BASE_URL ?? "",
        BRAID_MIDDLEWARE_SECRET_NAME: braidMiddlewareSecret.secretName,
      },
    });

    braidMiddlewareSecret.grantRead(healthCheck);

    // API Gateway
    const api = new apigateway.RestApi(this, "BraidMiddlewareApi", {
      restApiName: "Braid Middleware Service",
      deployOptions: {
        stageName: process.env.STAGE ?? "sandbox",
        throttlingRateLimit: 10,
        throttlingBurstLimit: 10,
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            principals: [new iam.AnyPrincipal()],
            actions: ["execute-api:Invoke"],
            resources: ["execute-api:/*"],
            conditions: {
              NotIpAddress: { "aws:SourceIp": allowedIps },
            },
          }),

          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AnyPrincipal()],
            actions: ["execute-api:Invoke"],
            resources: ["execute-api:/*"],
            conditions: {
              IpAddress: { "aws:SourceIp": allowedIps },
            },
          }),
        ],
      }),
    });

    const headers = {
      allowOrigins: ["*"],
      allowMethods: ["GET", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "X-User-Id",
        ...apigateway.Cors.DEFAULT_HEADERS,
      ],
      allowCredentials: true,
    };

    // GET → /braid/transactions
    const getTransactionsApi = api.root
      .addResource("braid")
      .addResource("transactions");

    getTransactionsApi.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getUncleanedTransactions),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    getTransactionsApi.addCorsPreflight(headers);

    // /braid/banks/{bankID}/transactions/{transactionID} POST → updateTransaction
    const updateTransactionApi = api.root
      .getResource("braid")
      ?.addResource("banks")
      ?.addResource("{bankId}")
      ?.addResource("transactions")
      ?.addResource("{transactionId}");

    updateTransactionApi?.addMethod(
      "POST",
      new apigateway.LambdaIntegration(updateTransaction),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    updateTransactionApi?.addCorsPreflight(headers);

    //  GET → /braid/sync/banks/{bankId}/transactions
    const syncTransactionsApi = api.root
      .getResource("braid")
      ?.addResource("sync")
      ?.addResource("banks")
      ?.addResource("{bankId}")
      ?.addResource("transactions");

    syncTransactionsApi?.addMethod(
      "GET",
      new apigateway.LambdaIntegration(syncTransactions),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    syncTransactionsApi?.addCorsPreflight(headers);

    // Sync products and programs GET → /braid/sync/banks/{bankId}/products-programs
    const syncProductAndProgramsApi = api.root
      .getResource("braid")
      ?.getResource("sync")
      ?.getResource("banks")
      ?.getResource("{bankId}")
      ?.addResource("products-programs");

    syncProductAndProgramsApi?.addMethod(
      "GET",
      new apigateway.LambdaIntegration(syncProductsAndPrograms),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    syncProductAndProgramsApi?.addCorsPreflight(headers);

    // Sync customers and counterparties GET → /braid/sync/{bankId}/customers-counterparties
    const syncCustomersAndCounterpartiesApi = api.root
      .getResource("braid")
      ?.getResource("sync")
      ?.getResource("banks")
      ?.getResource("{bankId}")
      ?.addResource("customers-counterparties");

    syncCustomersAndCounterpartiesApi?.addMethod(
      "GET",
      new apigateway.LambdaIntegration(syncCustomersAndCounterparties),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    syncCustomersAndCounterpartiesApi?.addCorsPreflight(headers);

    // Mark transaction as clean GET → /braid/banks/{bankId}/transactions/{transactionId}/mark-clean
    const markTransactionCleanApi = api.root
      .getResource("braid")
      ?.getResource("banks")
      ?.getResource("{bankId}")
      ?.getResource("transactions")
      ?.getResource("{transactionId}")
      ?.addResource("mark-clean");

    markTransactionCleanApi?.addMethod(
      "GET",
      new apigateway.LambdaIntegration(markTransactionAsClean),
      {
        authorizer,
        authorizationType: apigateway.AuthorizationType.CUSTOM,
      }
    );

    markTransactionCleanApi?.addCorsPreflight(headers);

    // Health Check GET → /braid/health
    const health = api.root.getResource("braid")?.addResource("health");

    health?.addMethod("GET", new apigateway.LambdaIntegration(healthCheck), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.CUSTOM,
    });

    health?.addCorsPreflight(headers);
  }
}
