const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const order = req.body || {};
  const product = order.product || 'Unknown Product';
  const name = order.name || 'Anonymous';
  const phone = order.phone || 'No Phone';
  const email = order.email || 'no-email@provided.com';
  const address = order.address || '-';
  const quantity = order.quantity || '1';
  const paymentMethod = order.paymentMethod || 'N/A';
  const notes = order.notes || '-';

  const isSubscription = product.toLowerCase().includes('plan') ||
    product.toLowerCase().includes('subscription') ||
    product.toLowerCase().includes('monthly') ||
    product.toLowerCase().includes('yearly');

  const orderType = isSubscription ? 'SUBSCRIPTION' : 'ORDER';

  const text = [
    `${orderType} - New Jibu Flow ${isSubscription ? 'Subscription' : 'Order'}`,
    `Product: ${product}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Address: ${address}`,
    `Qty: ${quantity}`,
    `Pay: ${paymentMethod}`,
    `Notes: ${notes}`
  ].join('\n');

  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', text);
    formData.append('_subject', `${isSubscription ? 'SUBSCRIPTION' : 'ORDER'}: ${product}`);

    const response = await fetch('https://formspree.io/f/mdalwkqn', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      console.log('Order notification sent via Formspree');
    }
  } catch (err) {
    console.error('Formspree error:', err.message);
  }

  const successMessage = isSubscription
    ? 'Subscription activated! Our team will contact you to set up your delivery schedule.'
    : 'Order placed successfully! You will receive a confirmation email shortly.';

  return res.status(200).json({
    success: true,
    orderId: Date.now().toString(),
    message: successMessage,
    isSubscription
  });
};
