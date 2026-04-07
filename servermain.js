require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serves ALL files

const emailUser = process.env.EMAIL_USER || "ntwariwesley@gmail.com";
const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// ORDER
app.post("/api/order", async (req, res) => {
  const { name, phone, address, product, quantity, email, notes } = req.body;

  try {
    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject: "New Order",
      html: `<h2>Order</h2>
             Name: ${name || ""}<br>
             Email: ${email || ""}<br>
             Phone: ${phone || ""}<br>
             Address: ${address || ""}<br>
             Product: ${product || ""}<br>
             Qty: ${quantity || ""}<br>
             Notes: ${notes || ""}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Order email failed", err);
    res.status(500).json({ success: false });
  }
});

// NEWSLETTER
app.post("/api/subscribe", async (req, res) => {
  try {
    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      subject: "Newsletter Signup",
      text: req.body.email || ""
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Newsletter email failed", err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log("🚀 Jibu Flow running on http://localhost:5000"));
