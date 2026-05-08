import { useEffect, useState } from "react";

function cacheKey(address) {
  return `geo:${address.toLowerCase().trim()}`;
}

async function geocodeAddress(address) {
  const key = cacheKey(address);
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const url =
    "https://nominatim.openstreetmap.org/search" +
    `?format=jsonv2&limit=1&countrycodes=it&q=${encodeURIComponent(address)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", "Accept-Language": "it" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.length) return null;

  const coords = { lat: Number(data[0].lat), lng: Number(data[0].lon) };
  localStorage.setItem(key, JSON.stringify(coords));
  return coords;
}

export function useGeocodedAlerts(inputAlerts) {
  const [alerts, setAlerts] = useState(inputAlerts);

  // riallinea state quando cambia input
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setAlerts(inputAlerts), [inputAlerts]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // SOLO quelli senza lat/lng ma con address
      const missing = inputAlerts.filter(
        (a) => (a.lat == null || a.lng == null) && a.address
      );
      if (!missing.length) return;

      const updates = new Map();

      for (const a of missing) {
        const coords = await geocodeAddress(a.address);
        if (coords) updates.set(a.id, coords);
        await new Promise((r) => setTimeout(r, 300));
      }

      if (cancelled) return;

      setAlerts((prev) =>
        prev.map((a) => {
          const u = updates.get(a.id);
          return u ? { ...a, ...u } : a;
        })
      );
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [inputAlerts]);

  return alerts;
}
