document.addEventListener("DOMContentLoaded", () => {

  const orderForm = document.getElementById("orderForm");
  if(orderForm){
    orderForm.addEventListener("submit", async e => {
      e.preventDefault();

      await fetch("/api/order", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          name: customerName.value,
          phone: customerPhone.value,
          address: address.value,
          product: product.value,
          quantity: quantity.value
        })
      });

      alert("Order Sent!");
    });
  }

  const subBtn = document.querySelector(".newsletter-btn");
  if(subBtn){
    subBtn.onclick = async () => {
      const email = document.querySelector(".newsletter-input").value;

      await fetch("/api/subscribe", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email })
      });

      alert("Subscribed!");
    };
  }

});
