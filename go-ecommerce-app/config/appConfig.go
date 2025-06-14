package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	ServerPort            string
	Dsn                   string
	AppSecret             string
	TwilioAccountSid      string
	TwilioAuthToken       string
	TwilioFromPhoneNumber string
}

func SetupEnv() (cfg AppConfig, err error) {
	if os.Getenv(("APP_ENV")) == "dev" {
		godotenv.Load()
	}
	httpPort := os.Getenv("SERVER_PORT")

	if len(httpPort) < 1 {
		return AppConfig{}, errors.New("SERVER_PORT is not set")
	}

	Dsn := os.Getenv("DSN")

	if len(Dsn) < 1 {
		return AppConfig{}, errors.New("DSN is not set")
	}

	appSecret := os.Getenv("APP_SECRET")

	if len(appSecret) < 1 {
		return AppConfig{}, errors.New("APP_SECRET is not set")
	}

	return AppConfig{ 
		ServerPort: httpPort, Dsn: Dsn, AppSecret: appSecret, 
		TwilioAccountSid:      os.Getenv("TWILIO_ACCOUNT_SID"),
		TwilioAuthToken:       os.Getenv("TWILIO_AUTH_TOKEN"),
		TwilioFromPhoneNumber: os.Getenv("TWILIO_FROM_PHONE_NUMBER")}, nil
}