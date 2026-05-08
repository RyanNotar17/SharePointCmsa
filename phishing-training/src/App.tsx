import { useState } from "react";
import emailjs from "@emailjs/browser";
import logoProva from "./assets/logo_prova.jpg";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSending(true);
    setSendError("");

    try {
      const response = await emailjs.send(
        "service_tlq2urs",
        "template_5ypwyvr",
        {
          user_email: email,
          password_inserted: passwordTouched ? "Sì" : "No",
          campaign_id: "test-cmsa-001",
          timestamp: new Date().toLocaleString("it-IT"),
          browser: navigator.userAgent,
        },
        {
          publicKey: "w0W9JAn603YnlLei6",
        }
      );

      console.log("EmailJS OK:", response);
      setSubmitted(true);
    } catch (error) {
      console.error("Errore EmailJS completo:", error);

      const err = error as {
        text?: string;
        message?: string;
      };

      const message =
        err?.text ||
        err?.message ||
        "Errore sconosciuto";

      setSendError(`Errore EmailJS: ${message}`);
    } finally {
      setIsSending(false);
    }
  }

  if (submitted) {
    return (
      <main className="page">
        <section className="card warning">
          <h1>Simulazione phishing aziendale</h1>

          <p>
            Questa era una simulazione interna di sicurezza.
          </p>

          <p className="safe-note">
            Le credenziali inserite non sono state salvate in nessuna maniera.
            Il test registra solo l’avvenuta compilazione del form ai fini della verifica interna.
          </p>

          <h2>Cosa controllare sempre</h2>

          <ul>
            <li>Verifica sempre il dominio del sito prima di inserire credenziali.</li>
            <li>Non inserire password dopo aver cliccato link sospetti.</li>
            <li>Controlla il mittente reale della mail.</li>
            <li>Diffida da urgenze, premi o blocchi account improvvisi.</li>
            <li>In caso di dubbio, contatta il reparto ICT.</li>
          </ul>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="login-card">
        <div className="logo-box">
          <img src={logoProva} alt="CMSA" className="logo-img" />
          <span></span>
        </div>

        <h1>Accedi</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) => setPasswordTouched(e.target.value.length > 0)}
            required
          />

          <p className="verify-text">
            Se non si ha un account,{" "}
            <a href="#" className="forgot-link">
              fare clic qui per crearne uno.
            </a>
          </p>

          <a href="#" className="forgot-link">
            Non ti ricordi la password?
          </a>

          {sendError && <p className="error-text">{sendError}</p>}

          <div className="button-row">
            <button type="button" className="back-button" disabled={isSending}>
              Indietro
            </button>

            <button type="submit" className="next-button" disabled={isSending}>
              {isSending ? "Invio..." : "Avanti"}
            </button>
          </div>
        </form>

        <footer>SharePoint - CMSA</footer>
      </section>
    </main>
  );
}