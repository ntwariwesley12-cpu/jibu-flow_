const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(orderForm);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Order placed successfully! You will receive an SMS notification shortly.');
            orderForm.reset();
        } else {
            alert('Failed to place order. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while placing the order. Please check your network connection.');
    }
});