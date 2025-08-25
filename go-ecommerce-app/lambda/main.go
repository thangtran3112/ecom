package main

import (
	"go-ecommerce-app/config"
	"go-ecommerce-app/internal/api"

	"github.com/aws/aws-lambda-go/lambda"
	fiberadapter "github.com/awslabs/aws-lambda-go-api-proxy/fiber"
)

var adapter *fiberadapter.FiberLambda

func init() {
    cfg, err := config.SetupEnv()
    if err != nil {
        // In Lambda, fail fast if env is not configured
        panic(err)
    }
    app := api.BuildApp(cfg)
    adapter = fiberadapter.New(app)
}

func main() {
    lambda.Start(adapter.ProxyWithContextV2)
}


