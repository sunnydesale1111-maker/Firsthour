import React from "react";

export default function StatusPill({ status, tone = "primary" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    emergency: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    muted: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${tones[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}