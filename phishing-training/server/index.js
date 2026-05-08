const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/track", async (req, res) => {
  try {
    const event = {
      email: req.body.email,
      password_inserted: Boolean(req.body.password_inserted),
      campaign_id: req.body.campaign_id,
      event_type: req.body.event_type,
      timestamp: req.body.timestamp,
      received_at: new Date().toISOString(),
    };

    await transporter.sendMail({
      from: `"Phishing Training" <${process.env.SMTP_USER}>`,
      to: process.env.REPORT_TO,
      subject: "Evento simulazione phishing",
      text: `
Evento simulazione phishing

Utente: ${event.email}
Ha inserito password: ${event.password_inserted ? "Sì" : "No"}
Campagna: ${event.campaign_id}
Evento: ${event.event_type}
Ora browser: ${event.timestamp}
Ora server: ${event.received_at}
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    res.status(500).json({ ok: false });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server avviato");
});