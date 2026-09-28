import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { SITUATIONS } from "@/lib/firsthourData";

export default function WhatHappened() {
  const navigate = useNavigate();
  return (
    <MobileShell>
      <TopBar title="What happened?" subtitle="Choose the closest match" />
      <div className="p-4 space-y-3 pb-8">
        <p className="text-sm text-muted-foreground">We'll recommend the right first-aid kit — no product hunting.</p>
        {SITUATIONS.map((s) => {
          if (!s.supported && !s.ambulance) {
            return (
              <div key={s.id} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 opacity-70">
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </div>
            );
          }
          return (
            <button
              key={s.id}
              onClick={() => navigate(s.ambulance ? "/ambulance" : `/kit?situation=${s.id}`)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left active:scale-[0.99] transition ${
                s.ambulance ? "border-red-200 bg-red-50/60" : "border-slate-200 bg-white"
              }`}
            >
              <span className="text-3xl">{s.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </MobileShell>
  );
}