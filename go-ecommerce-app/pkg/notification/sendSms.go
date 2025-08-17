package notification

import (
	"go-ecommerce-app/config"
)

type NotificationClient interface {
	SendSMS(phone string, message string) error
}

type notificationClient struct {
	config config.AppConfig
}

/**
* I have not subscribed to twilio yet, so I am not able to send SMS.
* See the verification code in the database
*/
func (n *notificationClient) SendSMS(phone string, message string) error {
	// accountSid := n.config.TwilioAccountSid
	// authToken := n.config.TwilioAuthToken

	// client := twilio.NewRestClientWithParams(twilio.ClientParams{
	// 	Username: accountSid,
	// 	Password: authToken,
	// })

	// params := &twilioApi.CreateMessageParams{}
	// params.SetTo(phone)
	// params.SetFrom(n.config.TwilioFromPhoneNumber)
	// params.SetBody(message)

	// resp, err := client.Api.CreateMessage(params)
	// if err != nil {
	// 	fmt.Println("Error sending SMS message: " + err.Error())
	// } else {
	// 	response, _ := json.Marshal(*resp)
	// 	fmt.Println("Response: " + string(response))
	// }
	return nil
}

func NewNotificationClient(config config.AppConfig) NotificationClient {
	return &notificationClient{config: config}
}