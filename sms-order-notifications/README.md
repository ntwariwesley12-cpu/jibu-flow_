# SMS Order Notifications

This project is designed to send SMS notifications when an order is made through a web application. It utilizes the Twilio API to send messages to a specified phone number whenever an order is processed.

## Project Structure

```
sms-order-notifications
├── src
│   ├── server.js            # Entry point of the application
│   ├── routes
│   │   └── orders.js        # Routes for order processing
│   ├── services
│   │   └── twilioService.js  # Service for sending SMS notifications
│   ├── public
│   │   ├── index.html       # Main HTML file for the web application
│   │   ├── styles.css       # Styles for the web application
│   │   └── app.js           # Client-side JavaScript
│   └── config
│       └── default.json     # Configuration settings
├── .env                      # Environment variables
├── package.json              # npm configuration file
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd sms-order-notifications
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   NOTIFICATION_PHONE_NUMBER=recipient_phone_number
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage

- Navigate to `http://localhost:3000` in your web browser.
- Fill out the order form and submit it.
- An SMS notification will be sent to the specified phone number upon successful order placement.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.