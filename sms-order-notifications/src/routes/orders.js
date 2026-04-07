const express = require('express');
const router = express.Router();
const TwilioService = require('../services/twilioService');

// POST route to create an order and send SMS notification
router.post('/orders', async (req, res) => {
    const { product, name, phone, address, quantity } = req.body;

    // Here you would typically save the order to a database

    // Prepare SMS message for owner (Jibu)
    const ownerMessage = `NEW ORDER:\nProduct: ${product}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nQuantity: ${quantity}`;

    try {
        const twilioService = new TwilioService(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
            process.env.TWILIO_MESSAGING_SERVICE_SID
        );
        
        // Send SMS to owner (+250787390669)
        await twilioService.sendSms(process.env.NOTIFICATION_PHONE_NUMBER, ownerMessage);
        
        res.status(201).json({ message: 'Order created! You will receive an SMS notification.' });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Order created, but failed to send SMS notification.' });
    }
});

module.exports = router;