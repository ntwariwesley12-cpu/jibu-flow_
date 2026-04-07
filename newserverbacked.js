require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ORDER API
app.post("/api/order", async (req, res) => {
  const { name, phone, address, product, quantity } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "🛒 New Jibu Flow Order",
    html: `
      <h2>New Order Received</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Address:</b> ${address}</p>
      <p><b>Product:</b> ${product}</p>
      <p><b>Quantity:</b> ${quantity}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Order sent!" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// NEWSLETTER API
app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "📩 New Newsletter Subscriber",
    text: `Subscriber Email: ${email}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
