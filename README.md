# PureFlow Water Sales Website

A full-stack web application for selling premium drinking water with AI chat assistant, payment processing, and order management.

## Features

- **Product Catalog**: Display of water products with pricing
- **AI Chat Assistant**: Intelligent chatbot for customer support
- **Payment Integration**: Support for Visa/Credit Card (Stripe), PayPal, and Momo Pay
- **Order Management**: Backend system for processing and tracking orders
- **Responsive Design**: Mobile-friendly interface
- **Real-time Notifications**: Toast notifications for user feedback

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive design with modern CSS

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Stripe for credit card payments
- PayPal SDK for PayPal payments
- Momo Pay integration (simulated)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Git

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env` file and update the values:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/pureflow
     STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key
     PAYPAL_CLIENT_ID=your_actual_paypal_client_id
     PAYPAL_CLIENT_SECRET=your_actual_paypal_client_secret
     ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the application**:
   ```bash
   npm start
   ```

6. **Access the website**:
   Open your browser and go to `http://localhost:3000`

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status

### Payments
- `POST /api/payments/process` - Process payment
- `POST /api/payments/confirm` - Confirm Stripe payment

### Chat
- `POST /api/chat` - Send message to AI assistant

## Payment Setup

### Stripe (Visa/Credit Card)
1. Sign up at [Stripe](https://stripe.com)
2. Get your API keys from the dashboard
3. Replace the test keys in `.env` with your actual keys

### PayPal
1. Sign up at [PayPal Developer](https://developer.paypal.com)
2. Create an app and get client ID and secret
3. Update `.env` with your credentials

### Momo Pay
Currently simulated for demonstration. For production, integrate with MTN Momo API.

## File Structure

```
pureflow-backend/
├── models/
│   ├── Order.js
│   └── User.js
├── routes/
│   ├── orders.js
│   ├── payments.js
│   └── chat.js
├── index.html
├── product-style.css
├── ai-helper.css
├── ai-helper.js
├── server.js
├── package.json
├── .env
└── README.md
```

## Usage

1. **Browse Products**: View available water products and pricing
2. **AI Assistant**: Click the chat button to get help from the AI assistant
3. **Place Order**: Click "Buy Now" or "Subscribe" to open the payment modal
4. **Payment**: Choose payment method and complete transaction
5. **Confirmation**: Receive order confirmation and success message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, contact us at support@pureflow.com or use the AI chat assistant on the website.