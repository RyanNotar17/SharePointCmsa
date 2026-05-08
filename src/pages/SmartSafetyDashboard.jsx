import { useMemo, useState } from "react";
import LiveMap from "../components/LiveMap";
import "./SmartSafetyDashboard.css";
import { useGeocodedAlerts } from "../hooks/useGeocodedAlerts";
import { useCurrentCity } from "../hooks/useCurrentCity";

// --- I TUOI DATI (uguali) ---
const alerts = [
  {
    id: "a1",
    title: "Terremoto Magnitudo 6.2",
    subtitle: "Zona Centro",
    time: "5 min fa",
    level: "danger",
    status: "in_corso",
    city: "Pistoia",
    address: "Via degli orafi, Pistoia, Italia",
  },
  {
    id: "a2",
    title: "Incendio",
    subtitle: "Zona Centro",
    time: "20 min fa",
    level: "warning",
    status: "in_corso",
    city: "Pistoia",
    address: "Sant’Agostino, Pistoia, Italia",
  },
  {
    id: "a3",
    title: "Allerta Meteo",
    subtitle: "Zona Ospedale",
    time: "1 ora fa",
    level: "info",
    status: "in_corso",
    city: "Pistoia",
    address: "Ospedale San Jacopo, Pistoia, Italia",
  },
];

const allAlerts = [
  { id: "pt1", title: "Terremoto avvertito", subtitle: "Centro Storico (Piazza del Duomo)", time: "5 min fa", level: "danger", status: "in_corso", city: "Pistoia", address: "Piazza del Duomo, 51100 Pistoia, Italia" },
  { id: "pt2", title: "Incendio segnalato", subtitle: "Sant’Agostino (zona industriale)", time: "12 min fa", level: "danger", status: "in_corso", city: "Pistoia", address: "Via di Sant'Agostino, 51100 Pistoia, Italia" },
  { id: "pt3", title: "Allerta meteo", subtitle: "Bottegone (piogge intense)", time: "25 min fa", level: "warning", city: "Pistoia", address: "Bottegone, 51100 Pistoia, Italia" },
  { id: "pt4", title: "Strada chiusa", subtitle: "Ponte Europa (traffico bloccato)", time: "40 min fa", level: "warning", city: "Pistoia", address: "Ponte Europa, Pistoia, Italia" },
  { id: "pt5", title: "Blackout diffuso", subtitle: "Stadio / Pistoia Ovest", time: "55 min fa", level: "warning", city: "Pistoia", address: "Stadio Marcello Melani, Pistoia, Italia" },
  { id: "pt6", title: "Allagamento", subtitle: "Pontelungo (sottopasso)", time: "1 ora fa", level: "warning", city: "Pistoia", address: "Pontelungo, Pistoia, Italia" },
  { id: "pt7", title: "Fuga gas (da verificare)", subtitle: "Chiazzano", time: "1 ora fa", level: "danger", city: "Pistoia", address: "Chiazzano, 51100 Pistoia, Italia" },
  { id: "pt8", title: "Segnalazione smottamento", subtitle: "Sammommè (zona collinare)", time: "1 ora fa", level: "warning", city: "Pistoia", address: "Sammommè, 51100 Pistoia, Italia" },
  { id: "pt9", title: "Punto di raccolta attivo", subtitle: "Parco Puccini", time: "1 ora fa", level: "info", city: "Pistoia", address: "Parco Puccini, Pistoia, Italia" },
  { id: "pt10", title: "Assistenza sanitaria", subtitle: "Ospedale San Jacopo", time: "1 ora fa", level: "info", city: "Pistoia", address: "Ospedale San Jacopo, Via Ciliegiole, Pistoia, Italia" },

  { id: "pt11", title: "Rallentamenti viabilità", subtitle: "Viale Adua", time: "2 ore fa", level: "info", city: "Pistoia", address: "Viale Adua, 51100 Pistoia, Italia" },
  { id: "pt12", title: "Strada interrotta", subtitle: "Via Fiorentina (tratto nord)", time: "2 ore fa", level: "warning", city: "Pistoia", address: "Via Fiorentina, 51100 Pistoia, Italia" },
  { id: "pt13", title: "Caduta alberi", subtitle: "Capostrada", time: "2 ore fa", level: "warning", city: "Pistoia", address: "Capostrada, 51100 Pistoia, Italia" },
  { id: "pt14", title: "Richiesta soccorso", subtitle: "Ponte Stella", time: "2 ore fa", level: "danger", city: "Pistoia", address: "Ponte Stella, Pistoia, Italia" },
  { id: "pt15", title: "Centro assistenza aperto", subtitle: "Palestra comunale (zona Stadio)", time: "3 ore fa", level: "info", city: "Pistoia", address: "Via dello Stadio, 51100 Pistoia, Italia" },
  { id: "pt16", title: "Allerta vento forte", subtitle: "Valdibrana", time: "3 ore fa", level: "warning", city: "Pistoia", address: "Valdibrana, 51100 Pistoia, Italia" },
  { id: "pt17", title: "Interruzione acqua", subtitle: "Le Fornaci", time: "3 ore fa", level: "info", city: "Pistoia", address: "Le Fornaci, 51100 Pistoia, Italia" },
  { id: "pt18", title: "Incendio boschivo", subtitle: "Candeglia (verso colline)", time: "4 ore fa", level: "danger", city: "Pistoia", address: "Candeglia, 51100 Pistoia, Italia" },
  { id: "pt19", title: "Area isolata", subtitle: "Ramini", time: "4 ore fa", level: "warning", city: "Pistoia", address: "Ramini, 51100 Pistoia, Italia" },
  { id: "pt20", title: "Punto medico avanzato", subtitle: "Piazza San Francesco", time: "4 ore fa", level: "info", city: "Pistoia", address: "Piazza San Francesco, 51100 Pistoia, Italia" },

  { id: "pt21", title: "Aggiornamento emergenza", subtitle: "Bonelle", time: "Ieri", level: "info", city: "Pistoia", address: "Bonelle, 51100 Pistoia, Italia" },
  { id: "pt22", title: "Chiusura scuole", subtitle: "Zona Pistoia Nord", time: "Ieri", level: "info", city: "Pistoia", address: "Pistoia Nord, 51100 Pistoia, Italia" },
  { id: "pt23", title: "Segnalazione frana", subtitle: "Spazzavento", time: "Ieri", level: "warning", city: "Pistoia", address: "Spazzavento, 51100 Pistoia, Italia" },
  { id: "pt24", title: "Viabilità ripristinata", subtitle: "Vergine", time: "Ieri", level: "info", city: "Pistoia", address: "Vergine, 51100 Pistoia, Italia" },
  { id: "pt25", title: "Dispersione elettrica", subtitle: "Belvedere", time: "2 giorni fa", level: "danger", city: "Pistoia", address: "Belvedere, Pistoia, Italia" },
  { id: "pt26", title: "Allerta idraulica", subtitle: "Ombrone Pistoiese (argini)", time: "2 giorni fa", level: "warning", city: "Pistoia", address: "Fiume Ombrone Pistoiese, Pistoia, Italia" },
  { id: "pt27", title: "Segnalazione incendio", subtitle: "Barile", time: "2 giorni fa", level: "warning", city: "Pistoia", address: "Barile, 51100 Pistoia, Italia" },
  { id: "pt28", title: "Richiesta viveri", subtitle: "Centro (famiglie con bambini)", time: "3 giorni fa", level: "info", city: "Pistoia", address: "Piazza della Sala, 51100 Pistoia, Italia" },
  { id: "pt29", title: "Viabilità deviata", subtitle: "Capannacce", time: "3 giorni fa", level: "info", city: "Pistoia", address: "Capannacce, 51100 Pistoia, Italia" },
  { id: "pt30", title: "Scossa di assestamento", subtitle: "Pistoia Est (zona Viale Adua)", time: "3 giorni fa", level: "danger", city: "Pistoia", address: "Pistoia Est, 51100 Pistoia, Italia" },
];


function LevelDot({ level }) {
  return <span className={`dot dot--${level}`} aria-hidden="true" />;
}

function Icon({ name }) {
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path
            d="M6.6 10.8c1.6 3 3.7 5.1 6.7 6.7l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2 1.9Z"
            fill="currentColor"
          />
        </svg>
      );
    case "flag":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path d="M6 2h2v20H6V2Zm3 2h10l-2 4 2 4H9V4Z" fill="currentColor" />
        </svg>
      );
    case "thumb":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path
            d="M2 10h4v12H2V10Zm20 1c0-1.1-.9-2-2-2h-6.3l1-4.6.1-.5c0-.5-.2-1-.6-1.4L13 1 6.6 7.4C6.2 7.8 6 8.3 6 8.8V20c0 1.1.9 2 2 2h8c.8 0 1.5-.5 1.8-1.2l3-7c.1-.3.2-.5.2-.8v-2Z"
            fill="currentColor"
          />
        </svg>
      );
    case "call":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path
            d="M20 3H4c-1.1 0-2 .9-2 2v2h20V5c0-1.1-.9-2-2-2Zm2 6H2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9Z"
            fill="currentColor"
          />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path
            d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5L3 18v1h18v-1l-2-2Z"
            fill="currentColor"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
          <path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 0-2 2V3Zm2 2v14h12V5H6Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SmartSafetyDashboard() {
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [userPos, setUserPos] = useState(null);

  // città dove sei (da GPS)
  const { city: currentCity } = useCurrentCity(userPos);

  // unisco e normalizzo status
  const merged = useMemo(
    () => [...alerts, ...allAlerts].map((a) => ({ ...a, status: a.status ?? "terminato" })),
    []
  );

  // solo IN CORSO
  const liveOnly = useMemo(() => merged.filter((a) => a.status === "in_corso"), [merged]);

  // geocoding (lat/lng) per i liveOnly
  const geocodedLive = useGeocodedAlerts(liveOnly);

  // filtro: SOLO avvisi della città dove sei
  const liveInMyCity = useMemo(() => {
    if (!currentCity) return geocodedLive; // se non ho ancora city, mostro tutti i live
    const c = currentCity.toLowerCase();
    return geocodedLive.filter((a) => (a.city || "").toLowerCase() === c);
  }, [geocodedLive, currentCity]);

  // lista recenti (solo city + live)
  const recentList = useMemo(() => {
    if (!currentCity) return alerts;
    const c = currentCity.toLowerCase();
    return alerts.filter((a) => (a.city || "").toLowerCase() === c);
  }, [currentCity]);

  // modal: tutti gli avvisi della città (in_corso in cima)
  const modalList = useMemo(() => {
    const normalized = allAlerts.map((a) => ({ ...a, status: a.status ?? "terminato" }));
    const filtered = !currentCity
      ? normalized
      : normalized.filter((a) => (a.city || "").toLowerCase() === currentCity.toLowerCase());

    return [...filtered].sort((x, y) =>
      x.status === y.status ? 0 : x.status === "in_corso" ? -1 : 1
    );
  }, [currentCity]);

  return (
    <div className="ss">
      <header className="topbar">
        <div className="brand">
          <img className="brand__logo" src="/smart_safety_icon_clean_transparent_1024.png" alt="" />
          <div className="brand__text">
            <div className="brand__name">Smart</div>
            <div className="brand__name">Safety</div>
          </div>
        </div>

        <div className="alertbar">
          <span className="alertbar__pill">
            <span className="alertbar__spark" aria-hidden="true" />
            <strong>ALLERTA:</strong>&nbsp;TERREMOTO IN CORSO
          </span>
        </div>

        <div className="topActions">
          <button className="topActions__btn" type="button">
            <Icon name="bell" />
            <span>Notifiche</span>
          </button>
          <button className="topActions__btn" type="button">
            <Icon name="book" />
            <span>Guide</span>
          </button>

          <div className="userChip" role="button" tabIndex={0}>
            <img className="userChip__avatar" src="https://i.pravatar.cc/64?img=12" alt="Avatar" />
            <span className="userChip__name">Marco Rossi</span>
            <span className="userChip__caret" aria-hidden="true">▾</span>
          </div>
        </div>
      </header>

      <section className="tiles">
        <button className="tile tile--red" type="button">
          <div className="tile__icon"><Icon name="phone" /></div>
          <div className="tile__text">
            <div className="tile__title">SOS</div>
            <div className="tile__sub">INTERVENTO</div>
          </div>
        </button>

        <button className="tile tile--orange" type="button">
          <div className="tile__icon"><Icon name="flag" /></div>
          <div className="tile__text">
            <div className="tile__title">INVIA</div>
            <div className="tile__sub">SEGNALAZIONE</div>
          </div>
        </button>

        <button className="tile tile--blue" type="button">
          <div className="tile__icon"><Icon name="thumb" /></div>
          <div className="tile__text">
            <div className="tile__title">ALLERTA</div>
            <div className="tile__sub">METEO</div>
          </div>
        </button>

        <button className="tile tile--green" type="button">
          <div className="tile__icon"><Icon name="call" /></div>
          <div className="tile__text">
            <div className="tile__title">CONTATTI</div>
            <div className="tile__sub">UTILI</div>
          </div>
        </button>
      </section>

      <main className="main">
        <section className="panel panel--left">
          <div className="panel__head">
            <h3>Avvisi Recenti</h3>
            <span style={{ opacity: 0.7, fontSize: 12 }}>
              {currentCity ? `Città: ${currentCity}` : "Città: rilevamento…"}
            </span>
          </div>

          <ul className="alertList">
            {recentList.map((a) => (
              <li key={a.id} className="alertRow">
                <LevelDot level={a.level} />

                <div className="alertRow__txt">
                  <div className="alertRow__title">{a.title}</div>
                  <div className="alertRow__sub">{a.subtitle}</div>
                </div>

                <div className="alertRow__meta">
                  <div className="alertRow__time">{a.time}</div>
                  <div className={`statusBadge statusBadge--${a.status}`}>
                    {a.status === "in_corso" ? "IN CORSO" : "TERMINATO"}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="panel__foot">
            <button className="linkBtn" type="button" onClick={() => setShowAllAlerts(true)}>
              Vedi Tutti
            </button>
          </div>
        </section>

        <section className="panel panel--map">
          <div className="panel__head panel__head--map">
            <h3>Segnalazioni in Tempo Reale</h3>
            <div className="mapTools">
              <button className="iconBtn" type="button" aria-label="Info">i</button>
              <button className="iconBtn" type="button" aria-label="Filtri">≡</button>
            </div>
          </div>

          <div className="map">
            {/* ✅ SOLO avvisi IN CORSO della tua città */}
            <LiveMap alerts={liveInMyCity} onUserPos={setUserPos} />
          </div>
        </section>
      </main>

      <footer className="bottom">
        <div className="bottom__left">
          <span className="bottom__label">STATO EMERGENZA</span>
          <span className="bottom__pill">
            ID Emergenza Segnalata: <strong>20394</strong> — Livello Attuale: <strong>ALTO</strong>
          </span>
        </div>

        <div className="bottom__right">
          <span className="bottom__pill">
            <strong>Richiesta di soccorso - 06/01/2026</strong>
            <span className="bottom__sub">Intervento preso in carico.</span>
          </span>
        </div>
      </footer>

      {showAllAlerts && (
        <div className="overlay" role="dialog" aria-modal="true" onClick={() => setShowAllAlerts(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <h3>Tutti gli Avvisi</h3>
              <button className="modal__close" onClick={() => setShowAllAlerts(false)} aria-label="Chiudi">
                ✕
              </button>
            </div>

            <div className="modal__body">
              <ul className="alertList alertList--modal">
                {modalList.map((a) => (
                  <li key={a.id} className="alertRow">
                    <LevelDot level={a.level} />
                    <div className="alertRow__txt">
                      <div className="alertRow__title">{a.title}</div>
                      <div className="alertRow__sub">{a.subtitle}</div>
                    </div>

                    <div className="alertRow__meta">
                      <div className="alertRow__time">{a.time}</div>
                      <div className={`statusBadge statusBadge--${a.status}`}>
                        {a.status === "in_corso" ? "IN CORSO" : "TERMINATO"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal__foot">
              <button className="btn" onClick={() => setShowAllAlerts(false)}>Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
