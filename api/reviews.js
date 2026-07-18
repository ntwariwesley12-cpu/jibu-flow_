module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const review = req.body || {};
  const name = review.name || 'Anonymous';
  const rating = review.rating || '5';
  const message = review.review || review.message || '';

  const text = `New Review from ${name} (${rating} stars):\n${message}`;

  try {
    const formData = new FormData();
    formData.append('email', review.email || 'no-email@provided.com');
    formData.append('message', text);
    formData.append('_subject', `New Review: ${name}`);

    await fetch('https://formspree.io/f/mdalwkqn', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
  } catch (err) {
    console.error('Formspree error:', err.message);
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you for your review! It has been submitted for moderation.'
  });
};
