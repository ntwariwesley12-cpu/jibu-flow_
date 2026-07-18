const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/jibu-flow', express.static(path.join(__dirname)));

app.get('/jibu-flow/*', (req, res) => {
  const file = req.params[0] || 'index.html';
  const fullPath = path.join(__dirname, file);
  res.sendFile(fullPath, (err) => {
    if (err) {
      res.status(404).send('Not Found');
    }
  });
});

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.warn('Twilio credentials are missing. SMS notifications will be disabled. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.');
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Socket.IO Real-time Chat
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('start_chat', (data) => {
    console.log('Chat started:', data);
    socket.emit('chat_started', { chatId: socket.id });
    
    // Simulate a seller joining for demo purposes
    setTimeout(() => {
      socket.emit('seller_joined', { name: 'Jibu Agent' });
    }, 3000);
  });

  socket.on('send_message', (data) => {
    // In a real app, forward this to the admin dashboard
    console.log('Message from user:', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/api/orders', async (req, res) => {
  const order = req.body;
  // Minimal validation so it doesn't crash easily
  const product = order.product || 'Unknown Product';
  const name = order.name || 'Anonymous';
  const phone = order.phone || 'No Phone';

  // Check if this is a subscription order
  const isSubscription = product.toLowerCase().includes('plan') ||
                        product.toLowerCase().includes('subscription') ||
                        product.toLowerCase().includes('monthly') ||
                        product.toLowerCase().includes('yearly');

  const ownerNumber = process.env.OWNER_PHONE_NUMBER || '+250787390669';
  const notifyEmail = process.env.OWNER_EMAIL || 'ntwariwesley12@gmail.com';

  const orderType = isSubscription ? '🔄 SUBSCRIPTION' : '📦 ORDER';
  const text = [
    `${orderType} - New Jibu Flow ${isSubscription ? 'Subscription' : 'Order'}`,
    `Product: ${product}`,
    `Name: ${name}`,
    `Email: ${order.email || notifyEmail}`,
    `Phone: ${phone}`,
    `Address: ${order.address}`,
    `Qty: ${order.quantity || '1'}`,
    `Pay: ${order.paymentMethod || 'N/A'}`,
    `Notes: ${order.notes || '-'}`,
    ...(isSubscription ? ['⚠️ IMPORTANT: Set up recurring billing for this subscription!'] : [])
  ].join('\n');

  console.log(`========== NEW ${isSubscription ? 'SUBSCRIPTION' : 'ORDER'} ==========`);
  console.log('Product:', product);
  console.log('Customer:', name);
  console.log('Phone:', phone);
  console.log('SMS to:', ownerNumber);
  console.log('Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID ? 'SET' : 'MISSING');
  console.log('Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN ? 'SET' : 'MISSING');
  console.log('Messaging Service SID:', process.env.TWILIO_MESSAGING_SERVICE_SID ? 'SET' : 'MISSING');
  console.log('================================');

  // 1. Send SMS (Twilio)
  try {
    if (client) {
      const smsOptions = {
        body: text,
        to: ownerNumber,
        from: '+13185088584'  // Your Twilio phone number
      };
      
      const message = await client.messages.create(smsOptions);
      console.log('✅ SMS sent successfully! Message SID:', message.sid);
    } else {
      console.warn('❌ Skipping Twilio SMS: Twilio client not initialized.');
    }
  } catch (err) {
    console.error('❌ Twilio error:', err.message);
    console.error('Full error:', err);
  }

  // 2. Send Email via Formspree (no setup required!)
  try {
    const formspreeUrl = 'https://formspree.io/f/mdalwkqn';
    const formData = new FormData();
    formData.append('email', order.email || 'no-email@provided.com');

    const emailSubject = isSubscription
      ? `🔄 NEW SUBSCRIPTION: ${product}`
      : `🛒 New Order: ${product}`;

    const emailMessage = `${orderType} ALERT!\n\n${isSubscription ? '🎉 NEW SUBSCRIPTION SIGNUP!\n\n' : ''}Product: ${product}\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${order.address}\nQuantity: ${order.quantity || '1'}\nPayment: ${order.paymentMethod || 'N/A'}\nNotes: ${order.notes || '-'}\n\n${isSubscription ? '⚠️ ACTION REQUIRED: Set up recurring billing and delivery schedule!\n\n' : ''}Time: ${new Date().toLocaleString()}`;

    formData.append('message', emailMessage);
    formData.append('_subject', emailSubject);

    const response = await fetch(formspreeUrl, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      console.log(`✅ ${isSubscription ? 'Subscription' : 'Order'} notification sent via Formspree!`);
    }
  } catch (err) {
    console.error('Formspree error:', err.message);
  }

  // Return success with an orderId as expected by frontend
  const successMessage = isSubscription
    ? '🎉 Subscription activated! Our team will contact you to set up your delivery schedule.'
    : '✅ Order placed successfully! You will receive a confirmation email shortly.';

  return res.json({
    success: true,
    orderId: Date.now().toString(),
    message: successMessage,
    isSubscription: isSubscription
  });
});

// Newsletter API
app.post('/api/newsletter', (req, res) => {
  console.log('Newsletter signup:', req.body.email);
  res.json({ success: true, message: 'Subscribed successfully!' });
});

// AI Chat API with enhanced context and personality
app.post('/api/ai-chat', async (req, res) => {
  const { message, language = 'en', pageContext } = req.body;

  if (!openai) {
    return res.json({ reply: "I am the Jibu Flow assistant. (OpenAI key not configured)" });
  }

  try {
    // Build comprehensive context for the AI
    const systemPrompt = `You are an enthusiastic and helpful AI assistant for Jibu Flow Water, a premium water company in Rwanda. Your personality is:
- Warm, friendly, and engaging
- Knowledgeable about water quality and sustainability
- Helpful and proactive in guiding customers
- Use emojis appropriately to make conversations lively (💧🌊💙🌟✨)
- Always end with a helpful question or call-to-action

COMPANY INFORMATION:
- Founded by KABOOKYA Milly in 2026
- Based in Rwanda
- Mission: Make clean, healthy water accessible to everyone while protecting the environment
- 50,000+ satisfied customers, 1M+ bottles delivered, 100% pure water, 98% satisfaction rate

PRODUCTS:
- 500ml Bottle (RWF 2,500): Perfect for on-the-go, BPA-free, recyclable
- 1L Bottle (RWF 3,900): Ideal for daily use, ergonomic design
- 5L Container (RWF 10,400): Best value for families and offices

SUBSCRIPTIONS:
- Weekly: Save 10%
- Monthly: Save 15%
- Corporate: Custom plans available

DELIVERY:
- Kigali: Same-day delivery (order before 2 PM)
- Provincial: 1-2 business days
- International: Available on request
- Free delivery on orders above RWF 20,000
- Real-time tracking available

PAYMENT METHODS:
- Mobile Money (MTN, Airtel)
- Credit/Debit Cards
- PayPal
- Cash on Delivery
- All payments 100% secure
- 30-day money-back guarantee

QUALITY:
- 7-stage purification process with UV sterilization
- Regular lab testing
- Certified by Rwanda Standards Board
- Natural spring water from protected sources

SUSTAINABILITY:
- 100% recyclable aluminum bottles
- Bottle return program
- Reduced plastic waste by 500,000+ bottles annually

CONTACT:
- Phone: 0787390669 / 0788496959
- Email: ntwariwesley@gmail.com
- 24/7 customer support

${pageContext ? `\nCURRENT PAGE: ${pageContext.page || 'Unknown'}` : ''}
${pageContext?.headings?.length ? `\nPAGE TOPICS: ${pageContext.headings.slice(0, 5).join(', ')}` : ''}

LANGUAGE: Respond in ${language === 'rw' ? 'Kinyarwanda' : language === 'fr' ? 'French' : language === 'sw' ? 'Swahili' : 'English'}

Always be helpful, provide specific information, and guide customers toward making a purchase or getting more information. Keep responses concise but informative (2-4 paragraphs max).`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.8, // More creative and engaging
      max_tokens: 500
    });
    
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting right now. But I'm still here to help! Try asking me about our products, delivery, or pricing. 😊" });
  }
});

// Payment Mocks (needed by frontend)
app.post('/api/payments/process', (req, res) => {
  res.json({ status: 'succeeded' });
});

app.post('/api/payments/stripe-intent', (req, res) => {
  res.json({ clientSecret: 'mock_stripe_secret_key' });
});

const PORT = process.env.PORT || 3005;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. If you have another instance running, stop it and restart this server.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
