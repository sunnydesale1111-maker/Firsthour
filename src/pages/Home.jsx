import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Clock, ChevronRight } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import LocationBar from "@/components/LocationBar";
import { SITUATIONS } from "@/lib/firsthourData";

export default function Home() {
  return (
    <MobileShell>
      <LocationBar />

      <div className="px-4 pt-2 pb-6 space-y-5">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-lg shadow-emerald-500/20">
          <p className="text-xs font-medium text-emerald-50/90 uppercase tracking-wider">FirstHour by Betterhood</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">The right first aid, for the first hour.</h1>
          <div className="mt-3 flex items-center gap-4 text-xs text-emerald-50">
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 10-min delivery</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Guided kit</span>
            <span className="inline-flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> One-tap order</span>
          </div>
        </div>

        {/* Situation entry */}
        <div>
          <h2 className="text-lg font-bold text-foreground">What happened?</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Pick your situation — we'll handle the rest.</p>

          <div className="mt-3 space-y-2.5">
            {SITUATIONS.map((s) => {
              const card = (
                <div
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                    s.ambulance
                      ? "border-red-200 bg-red-50/60"
                      : s.supported
                      ? "border-slate-200 bg-white"
                      : "border-slate-100 bg-slate-50/70 opacity-70"
                  }`}
                >
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-white shadow-sm text-2xl shrink-0">
                    {s.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              );

              if (!s.supported && !s.ambulance) return <div key={s.id}>{card}</div>;
              return (
                <Link
                  key={s.id}
                  to={s.ambulance ? "/ambulance" : `/kit?situation=${s.id}`}
                  className="block active:scale-[0.99] transition"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trust strip */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Safety first</p>
          <p className="text-sm text-foreground mt-1 leading-relaxed">
            Not sure if it's serious? Use <span className="font-semibold text-red-600">Need medical help</span> to escalate to an ambulance with a 5-minute arrival target in serviced areas.
          </p>
        </div>
      </div>
    </MobileShell>
  );
}