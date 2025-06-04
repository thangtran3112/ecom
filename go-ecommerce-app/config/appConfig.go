package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	ServerPort            string
}

func SetupEnv() (cfg AppConfig, err error) {
	if os.Getenv(("APP_ENV")) == "dev" {
		godotenv.Load()
	}
	httpPort := os.Getenv("SERVER_PORT")

	if len(httpPort) < 1 {
		return AppConfig{}, errors.New("SERVER_PORT is not set")
	}

	return AppConfig{ ServerPort: httpPort}, nil
}