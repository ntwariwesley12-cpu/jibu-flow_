class TwilioService {
    constructor(accountSid, authToken, messagingServiceSid) {
        const twilio = require('twilio');
        this.client = twilio(accountSid, authToken);
        this.messagingServiceSid = messagingServiceSid;
    }

    async sendSms(toPhoneNumber, message) {
        try {
            const messageResponse = await this.client.messages.create({
                body: message,
                messagingServiceSid: this.messagingServiceSid,
                to: toPhoneNumber
            });
            return messageResponse;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }
}

module.exports = TwilioService;