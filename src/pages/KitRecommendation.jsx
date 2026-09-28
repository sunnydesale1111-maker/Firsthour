import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Check, ShieldAlert, QrCode, ArrowRight } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { getKit } from "@/lib/firsthourData";

export default function KitRecommendation() {
  const navigate = useNavigate();
  const kit = getKit(new URLSearchParams(window.location.search).get("situation"));

  return (
    <MobileShell>
      <TopBar title="FirstHour Kit" subtitle={kit.situationLabel} />
      <div className="p-4 pb-8 space-y-5">
        {/* Kit card */}
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-44 bg-gradient-to-br from-emerald-100 to-teal-100 grid place-items-center relative">
            <span className="text-6xl">{kit.emoji}</span>
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" /> {kit.eta} min
            </span>
          </div>
          <div className="p-4">
            <h2 className="text-lg font-bold text-foreground">{kit.name}</h2>
            <p className="text-sm text-muted-foreground">{kit.tagline}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">₹{kit.price}</span>
              <span className="text-xs text-muted-foreground">all-in · target delivery within {kit.eta} min</span>
            </div>

            <div className="mt-4 space-y-2">
              {kit.contents.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions preview */}
        <div className="rounded-2xl bg-slate-900 text-white p-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <p className="font-semibold">Visual + QR instructions inside</p>
          </div>
          <p className="text-xs text-slate-300 mt-1">Scan the QR card for a 60-second usage video.</p>
        </div>

        {/* Safety */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
              <p className="font-semibold text-sm">Red-flag symptoms — seek medical care</p>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-amber-800 list-disc pl-5">
              {kit.redFlags.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-sm text-foreground">Safe usage</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc pl-5">
              {kit.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/checkout?kit=${kit.id}`)}
          className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition shadow-lg shadow-primary/20"
        >
          Get FirstHour · ₹{kit.price} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </MobileShell>
  );
}