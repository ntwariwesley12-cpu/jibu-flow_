const sendEmail = require("./email");

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendEmail({
      to: "yourbusiness@gmail.com",
      subject: "New Contact Message",
      text: `From: ${name} (${email})\n\n${message}`
    });

    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email failed" });
  }
});
