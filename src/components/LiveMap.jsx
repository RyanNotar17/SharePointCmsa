import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

function levelColor(level) {
  switch (level) {
    case "danger":
      return "#d51b25";
    case "warning":
      return "#f08a28";
    default:
      return "#3aa0ff";
  }
}

/** Control Leaflet in basso a sinistra: click => zoom su di me */
function LocateControl({ pos, loading, err, targetZoom }) {
  const map = useMap();
  const controlRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const control = L.control({ position: "bottomleft" });

    control.onAdd = () => {
      const div = L.DomUtil.create("div", "ssLocate");

      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "10px";
      div.style.padding = "10px 12px";
      div.style.borderRadius = "14px";
      div.style.border = "1px solid rgba(255,255,255,.14)";
      div.style.background = "rgba(0,0,0,.60)";
      div.style.color = "white";
      div.style.fontSize = "12px";
      div.style.cursor = "pointer";
      div.style.userSelect = "none";

      div.innerHTML = `
        <span style="
          width:18px;height:18px;
          display:inline-grid;place-items:center;
          border-radius:999px;
          border:1px solid rgba(255,255,255,.28);
          background:rgba(255,255,255,.06);
          line-height:1;
        ">⦿</span>
        <span class="ssLocate__text"></span>
      `;

      textRef.current = div.querySelector(".ssLocate__text");

      // IMPORTANT: evita che Leaflet “mangi” il click o faccia drag
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      div.addEventListener("click", () => {
        if (!pos) return;
        map.flyTo([pos.lat, pos.lng], targetZoom, { animate: true, duration: 0.8 });
      });

      return div;
    };

    control.addTo(map);
    controlRef.current = control;

    return () => control.remove();
  }, [map, pos, targetZoom]);

  useEffect(() => {
    if (!textRef.current) return;
    if (loading) textRef.current.textContent = "GPS: ricerca posizione…";
    else if (pos) textRef.current.textContent = `GPS: OK ±${Math.round(pos.accuracy)}m`;
    else textRef.current.textContent = `GPS: NON disponibile (${err || "permesso negato"})`;
  }, [pos, loading, err]);

  return null;
}

/** Layer posizione: pallino blu cliccabile + cerchio accuratezza */
function MyPosition({ pos, targetZoom }) {
  const map = useMap();
  const didInit = useRef(false);

  // al primo fix GPS: centra e zooma
  useEffect(() => {
    if (!pos || didInit.current) return;
    didInit.current = true;
    map.setView([pos.lat, pos.lng], targetZoom, { animate: true });
    setTimeout(() => map.invalidateSize(), 50);
  }, [pos, targetZoom, map]);

  if (!pos) return null;

  const zoomToMe = () => map.flyTo([pos.lat, pos.lng], targetZoom, { animate: true, duration: 0.8 });

  return (
    <>
      {/* 1) Marker classico (icona a goccia) */}
      <Marker position={[pos.lat, pos.lng]} eventHandlers={{ click: zoomToMe }}>
        <Popup>Sei qui</Popup>
      </Marker>

      {/* 2) Pallino blu (cliccabile) */}
      <CircleMarker
        center={[pos.lat, pos.lng]}
        radius={8}
        pathOptions={{
          color: "rgba(255,255,255,.85)",
          weight: 2,
          fillColor: "#3aa0ff",
          fillOpacity: 1,
        }}
        eventHandlers={{ click: zoomToMe }}
      />

      {/* 3) Accuratezza (cliccabile) */}
      <Circle
        center={[pos.lat, pos.lng]}
        radius={Math.max(10, pos.accuracy || 30)}
        pathOptions={{ weight: 1 }}
        eventHandlers={{ click: zoomToMe }}
      />
    </>
  );
}

export default function LiveMap({ alerts = [] }) {
  const [pos, setPos] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // fallback se GPS non disponibile
  const fallback = { lat: 43.7696, lng: 11.2558 };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErr("Geolocalizzazione non supportata dal browser.");
      setLoading(false);
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy,
        });
        setErr("");
        setLoading(false);
      },
      (e) => {
        setErr(e.message || "Permesso negato / posizione non disponibile.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const targetZoom = useMemo(() => {
    if (!pos) return 12;
    const a = pos.accuracy ?? 9999;
    if (a <= 25) return 18;
    if (a <= 60) return 17;
    if (a <= 150) return 16;
    return 15;
  }, [pos]);

  const center = pos ? [pos.lat, pos.lng] : [fallback.lat, fallback.lng];

  const alertsOnMap = useMemo(
    () => alerts.filter((a) => Number.isFinite(a.lat) && Number.isFinite(a.lng)),
    [alerts]
  );

  return (
    <MapContainer center={center} zoom={targetZoom} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* posizione + click-to-zoom */}
      <MyPosition pos={pos} targetZoom={targetZoom} />

      {/* pulsante target bottom-left */}
      <LocateControl pos={pos} loading={loading} err={err} targetZoom={targetZoom} />

      {/* avvisi (se li passi via props) */}
      {alertsOnMap.map((a) => (
        <CircleMarker
          key={a.id}
          center={[a.lat, a.lng]}
          radius={8}
          pathOptions={{
            color: "rgba(255,255,255,.65)",
            weight: 1,
            fillColor: levelColor(a.level),
            fillOpacity: 0.95,
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong>{a.title}</strong>
              <div style={{ opacity: 0.85, marginTop: 4 }}>{a.subtitle}</div>
              <div style={{ opacity: 0.7, marginTop: 6 }}>{a.time}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
