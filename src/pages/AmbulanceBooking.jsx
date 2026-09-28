import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, AlertTriangle, Clock, ShieldCheck, Loader2, Check } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { useLocation } from "@/lib/LocationContext";
import { base44 } from "@/api/base44Client";

export default function AmbulanceBooking() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const [confirmed, setConfirmed] = useState(false);
  const [booking, setBooking] = useState(false);

  const serviceable = true; // mock coverage check

  const book = async () => {
    setBooking(true);
    try {
      const req = await base44.entities.AmbulanceRequest.create({
        status: "confirmed",
        location_line: location.line,
        eta_minutes: 5,
        vehicle_number: "DL-01-AM-2026",
        driver_name: "Ramesh Kumar",
        driver_phone: "+91-98765-43210",
      });
      navigate(`/ambulance/track/${req.id}`);
    } catch {
      setBooking(false);
      alert("Could not book ambulance. Try again.");
    }
  };

  return (
    <MobileShell showNav={false}>
      <TopBar title="Ambulance" subtitle="Professional medical help" />
      <div className="p-4 space-y-5 pb-8">
        {/* Emergency banner */}
        <div className="rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 text-white p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-bold">Emergency escalation</p>
          </div>
          <p className="text-sm text-red-50 mt-1">For situations needing professional medical help. This is not a diagnosis tool.</p>
        </div>

        {/* Location confirm */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Confirm pickup location</p>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{location.label}</p>
              <p className="text-xs text-muted-foreground">{location.line}</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmed((c) => !c)}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition ${
              confirmed ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-foreground"
            }`}
          >
            {confirmed ? <><Check className="w-4 h-4" /> Location confirmed</> : "Tap to confirm location"}
          </button>
        </div>

        {/* Availability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Ambulance availability</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {serviceable ? "Serviceable area · 3 ambulances nearby" : "Limited availability in your area"}
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${serviceable ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              {serviceable ? "AVAILABLE" : "LIMITED"}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>Target arrival: <span className="font-bold">within 5 minutes</span> in this service zone</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">5-min SLA applies only where dispatch capacity supports it.</p>
        </div>

        {/* Safety note */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-xs font-semibold">If life-threatening, also call 112 directly.</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={book}
          disabled={!confirmed || booking}
          className="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg shadow-red-500/20 disabled:opacity-50"
        >
          {booking ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking…</> : <><AlertTriangle className="w-5 h-5" /> Book ambulance now</>}
        </button>
        {!confirmed && <p className="text-center text-xs text-muted-foreground">Confirm your location to book</p>}
      </div>
    </MobileShell>
  );
}