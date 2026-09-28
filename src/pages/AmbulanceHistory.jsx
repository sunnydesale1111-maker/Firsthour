import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ambulance, Loader2, ChevronRight } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import StatusPill from "@/components/StatusPill";
import { base44 } from "@/api/base44Client";

const STATUS_LABEL = { confirmed: "Confirmed", assigned: "Assigned", on_the_way: "On the way", arrived: "Arrived" };
const STATUS_TONE = { confirmed: "amber", assigned: "primary", on_the_way: "primary", arrived: "green" };

export default function AmbulanceHistory() {
  const [reqs, setReqs] = useState(null);
  useEffect(() => {
    base44.entities.AmbulanceRequest.list("-created_date", 50).then(setReqs).catch(() => setReqs([]));
  }, []);

  return (
    <MobileShell>
      <TopBar title="Ambulance history" subtitle="Medical assistance requests" />
      <div className="p-4 space-y-3 pb-8">
        {!reqs && <div className="grid place-items-center py-16"><Loader2 className="w-6 h-6 animate-spin text-red-500" /></div>}
        {reqs && reqs.length === 0 && (
          <div className="text-center py-16">
            <Ambulance className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">No ambulance requests yet.</p>
            <Link to="/ambulance" className="text-red-500 text-sm font-semibold mt-2 inline-block">Request an ambulance</Link>
          </div>
        )}
        {reqs?.map((r) => (
          <Link key={r.id} to={`/ambulance/track/${r.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 active:scale-[0.99] transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-red-50 text-red-500"><Ambulance className="w-5 h-5" /></span>
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.vehicle_number || "Ambulance"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_date).toLocaleString()}</p>
                </div>
              </div>
              <StatusPill status={STATUS_LABEL[r.status]} tone={STATUS_TONE[r.status]} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{r.location_line}</span>
              <span className="inline-flex items-center gap-1 text-primary font-medium">View <ChevronRight className="w-3 h-3" /></span>
            </div>
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}