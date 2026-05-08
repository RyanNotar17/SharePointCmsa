import { useEffect, useState } from "react";

export function useGeolocation(options) {
  const [pos, setPos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Geolocalizzazione non supportata dal dispositivo/browser.");
      setLoading(false);
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000,
      ...options,
    };

    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy,
          timestamp: p.timestamp,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Permesso negato o posizione non disponibile.");
        setLoading(false);
      },
      geoOptions
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { pos, error, loading };
}
