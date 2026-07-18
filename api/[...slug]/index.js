module.exports = async (req, res) => {
  const path = req.url || '';

  // Newsletter
  if (path.includes('/api/newsletter') && req.method === 'POST') {
    return res.status(200).json({ success: true, message: 'Subscribed successfully!' });
  }

  // AI chat (graceful fallback without backend key)
  if (path.includes('/api/ai-chat') && req.method === 'POST') {
    return res.status(200).json({
      reply: "I am the Jibu Flow assistant. For live AI responses, please configure an OpenAI key. Meanwhile, you can browse our Products, Pricing, or Contact pages for help! 💧"
    });
  }

  // Payments mock
  if (path.includes('/api/payments')) {
    return res.status(200).json({ status: 'succeeded', clientSecret: 'mock_stripe_secret_key' });
  }

  return res.status(200).json({ success: true, message: 'OK' });
};
