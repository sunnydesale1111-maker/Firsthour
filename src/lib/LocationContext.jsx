import React, { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

const DEFAULT_LOCATION = {
  label: "Sector 14, Gurugram",
  line: "Sector 14, Gurugram, Haryana 122001",
  coords: null,
};

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem("fh_location");
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });
  const [detecting, setDetecting] = useState(false);

  const persist = (loc) => {
    setLocation(loc);
    try {
      localStorage.setItem("fh_location", JSON.stringify(loc));
    } catch {}
  };

  const detect = () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      setTimeout(() => setDetecting(false), 600);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        persist({
          label: "Current location (GPS)",
          line: "Detected via GPS · Sector 14, Gurugram",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
        setDetecting(false);
      },
      () => {
        setDetecting(false);
      },
      { timeout: 5000 }
    );
  };

  useEffect(() => {
    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation: persist, detecting, detect }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}