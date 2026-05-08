import { useEffect, useState } from "react";

function round3(n) {
  return Math.round(n * 1000) / 1000; // ~100m
}

async function reverseCity(lat, lng) {
  const key = `revgeo:${round3(lat)},${round3(lng)}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const url =
    "https://nominatim.openstreetmap.org/reverse" +
    `?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}` +
    `&zoom=10&addressdetails=1`;

  const res = await fetch(url, {
    headers: { Accept: "application/json", "Accept-Language": "it" },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const addr = data?.address || {};

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.county ||
    null;

  const out = { city, addr };
  localStorage.setItem(key, JSON.stringify(out));
  return out;
}

export function useCurrentCity(userPos) {
  const [city, setCity] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!userPos?.lat || !userPos?.lng) return;

    reverseCity(userPos.lat, userPos.lng)
      .then((r) => {
        if (cancelled) return;
        setCity(r?.city ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setCity(null);
      });

    return () => {
      cancelled = true;
    };
  }, [userPos?.lat, userPos?.lng]);

  return { city };
}
