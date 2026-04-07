// AI Helper JavaScript for PureFlow Website

// DOM Elements
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatMinimize = document.getElementById('chatMinimize');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const notificationContainer = document.getElementById('notificationContainer');
const welcomeModal = document.getElementById('welcomeModal');
const successModal = document.getElementById('successModal');

// Chat Toggle Functionality
let chatOpen = false;
let toggleTimeout;

// Initially hide the chat toggle
chatToggle.style.display = 'none';

// Function to show chat toggle
function showChatToggle() {
    chatToggle.style.display = 'block';
    // Hide it again after 10 seconds of inactivity
    clearTimeout(toggleTimeout);
    toggleTimeout = setTimeout(() => {
        if (!chatOpen) {
            chatToggle.style.display = 'none';
        }
    }, 10000);
}

// Function to hide chat toggle
function hideChatToggle() {
    clearTimeout(toggleTimeout);
    chatToggle.style.display = 'none';
}

chatToggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    if (chatOpen) {
        chatWidget.style.display = 'flex';
        chatToggle.style.display = 'none';
        chatInput.focus();
        clearTimeout(toggleTimeout); // Clear any pending hide timeout
    } else {
        chatWidget.style.display = 'none';
        chatToggle.style.display = 'block';
        // Hide toggle after 5 seconds when chat is closed
        toggleTimeout = setTimeout(() => {
            chatToggle.style.display = 'none';
        }, 5000);
    }
});

chatMinimize.addEventListener('click', () => {
    chatOpen = false;
    chatWidget.style.display = 'none';
    chatToggle.style.display = 'block';
    // Hide toggle after 5 seconds when minimized
    toggleTimeout = setTimeout(() => {
        chatToggle.style.display = 'none';
    }, 5000);
});

// Send Message Function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        hideTypingIndicator();

        if (response.ok) {
            addMessage(data.response, 'bot');
        } else {
            addMessage('Sorry, I\'m having trouble responding right now. Please try again.', 'bot');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage('Network error. Please check your connection and try again.', 'bot');
    }
}

// Event Listeners
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Add Message to Chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing Indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    notificationContainer.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, duration);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Welcome Modal
document.getElementById('closeWelcome').addEventListener('click', () => hideModal('welcomeModal'));
document.getElementById('applyDiscount').addEventListener('click', () => {
    showNotification('Discount code PUREWATER20 applied!', 'success');
    hideModal('welcomeModal');
});

// Success Modal
document.getElementById('closeSuccess').addEventListener('click', () => hideModal('successModal'));
document.getElementById('closeSuccessBtn').addEventListener('click', () => hideModal('successModal'));

// Order Buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent.includes('Buy') || btn.textContent.includes('Subscribe') || btn.textContent.includes('Order')) {
        btn.addEventListener('click', () => showPaymentModal());
    }
});

// Payment Modal
function showPaymentModal() {
    showModal('paymentModal');
    initializeStripe();
}

// Close payment modal
document.getElementById('closePayment').addEventListener('click', () => hideModal('paymentModal'));

// Stripe integration
let stripe;
let cardElement;

function initializeStripe() {
    if (!stripe) {
        stripe = Stripe('pk_test_your_stripe_publishable_key_here'); // Replace with actual key
        const elements = stripe.elements();
        cardElement = elements.create('card');
        cardElement.mount('#cardElement');
    }

    // Show/hide card element based on payment method
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'stripe') {
                document.getElementById('cardElement').style.display = 'block';
            } else {
                document.getElementById('cardElement').style.display = 'none';
            }
        });
    });
}

// Payment form submission
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        address: document.getElementById('address').value,
        product: document.getElementById('product').value,
        quantity: parseInt(document.getElementById('quantity').value),
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    // Calculate total (simple calculation)
    const priceMap = {
        '500ml Bottle': 1.99,
        '1L Bottle': 2.99,
        '5L Container': 7.99
    };
    formData.totalAmount = priceMap[formData.product] * formData.quantity;

    try {
        // Create order first
        const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!orderResponse.ok) throw new Error('Failed to create order');

        const orderData = await orderResponse.json();
        const orderId = orderData.orderId;

        // Process payment
        let paymentResult;
        const paymentData = { paymentMethod: formData.paymentMethod, amount: formData.totalAmount, orderId };

        if (formData.paymentMethod === 'stripe') {
            // Handle Stripe payment
            const { clientSecret } = await processStripePayment(paymentData);
            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (error) throw new Error(error.message);
            paymentResult = { status: 'succeeded' };
        } else {
            // Handle other payments
            const paymentResponse = await fetch('/api/payments/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });

            if (!paymentResponse.ok) throw new Error('Payment failed');
            paymentResult = await paymentResponse.json();
        }

        // Success
        hideModal('paymentModal');
        document.getElementById('successMessage').textContent = `Your order #${orderId} has been placed successfully! Payment received via ${formData.paymentMethod.toUpperCase()}.`;
        showModal('successModal');
        showNotification('Order placed successfully!', 'success');

    } catch (error) {
        showNotification(`Payment failed: ${error.message}`, 'error');
    }
});

async function processStripePayment(data) {
    const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to process payment');
    return await response.json();
}

// Show welcome modal on page load (after a delay)
setTimeout(() => {
    showModal('welcomeModal');
}, 2000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Any initialization code here
});