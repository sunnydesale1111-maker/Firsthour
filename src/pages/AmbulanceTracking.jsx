import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, MapPin, Phone, MessageSquare, X, Loader2, Ambulance } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { AMBULANCE_FLOW } from "@/lib/firsthourData";
import { base44 } from "@/api/base44Client";

export default function AmbulanceTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const r = await base44.entities.AmbulanceRequest.get(id);
        setReq(r);
        sub = base44.entities.AmbulanceRequest.subscribe((event) => {
          if (event.id === id) setReq(event.data);
        });
      } catch {
      } finally {
        setLoading(false);
      }
    })();
    return () => sub && sub();
  }, [id]);

  useEffect(() => {
    if (!req || req.status === "arrived") return;
    const idx = AMBULANCE_FLOW.findIndex((s) => s.key === req.status);
    const next = AMBULANCE_FLOW[idx + 1];
    if (!next) return;
    const t = setTimeout(async () => {
      try {
        const updated = await base44.entities.AmbulanceRequest.update(req.id, { status: next.key });
        setReq(updated);
      } catch {}
    }, 7000);
    return () => clearTimeout(t);
  }, [req]);

  if (loading) {
    return (
      <MobileShell showNav={false}>
        <TopBar title="Ambulance tracking" />
        <div className="grid place-items-center py-20"><Loader2 className="w-7 h-7 animate-spin text-red-500" /></div>
      </MobileShell>
    );
  }

  if (!req) {
    return (
      <MobileShell showNav={false}>
        <TopBar title="Ambulance tracking" />
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Request not found.</p>
          <Link to="/" className="text-primary text-sm font-semibold mt-2 inline-block">Back home</Link>
        </div>
      </MobileShell>
    );
  }

  const currentIdx = AMBULANCE_FLOW.findIndex((s) => s.key === req.status);
  const progress = ((currentIdx + 1) / AMBULANCE_FLOW.length) * 100;
  const arrived = req.status === "arrived";

  return (
    <MobileShell showNav={false}>
      <TopBar title="Ambulance tracking" />
      <div className="p-4 space-y-5 pb-8">
        {/* ETA */}
        <div className={`rounded-3xl text-white p-5 ${arrived ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
          <div className="flex items-center gap-2 text-white/80 text-xs font-medium uppercase tracking-wide">
            <Clock className="w-4 h-4" /> {arrived ? "Status" : "Arriving in"}
          </div>
          <p className="text-3xl font-bold mt-1">{arrived ? "Arrived" : `~${req.eta_minutes} min`}</p>
          <p className="text-sm text-white/90 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location_line}</p>
        </div>

        {/* Vehicle details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-red-50 text-red-500"><Ambulance className="w-6 h-6" /></span>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Vehicle</p>
              <p className="font-bold text-foreground">{req.vehicle_number}</p>
              <p className="text-xs text-muted-foreground">Driver: {req.driver_name}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <a href={`tel:${req.driver_phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
              <Phone className="w-4 h-4" /> Call
            </a>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-medium">
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-foreground mb-3">Live status</p>
          <div className="h-1.5 rounded-full bg-slate-100 mb-4 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-3">
            {AMBULANCE_FLOW.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className={`grid place-items-center w-8 h-8 rounded-full text-sm transition ${done ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {done ? "✓" : s.emoji}
                  </span>
                  <span className={`text-sm ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
                  {i === currentIdx && <span className="ml-auto text-[10px] font-semibold text-red-500">NOW</span>}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 flex items-center justify-center gap-2 text-sm font-medium text-foreground"
        >
          <X className="w-4 h-4" /> Cancel / back to home
        </button>
      </div>
    </MobileShell>
  );
}