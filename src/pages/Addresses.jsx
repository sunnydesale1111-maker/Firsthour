import React, { useEffect, useState } from "react";
import { Plus, Loader2, Check, Trash2, MapPin } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { useLocation } from "@/lib/LocationContext";
import { base44 } from "@/api/base44Client";

const LABELS = ["Home", "Work", "Other"];

export default function Addresses() {
  const { location, setLocation } = useLocation();
  const [addresses, setAddresses] = useState(null);
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("Home");
  const [line, setLine] = useState("");

  const load = () => base44.entities.Address.list().then(setAddresses).catch(() => setAddresses([]));

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!line.trim()) return;
    await base44.entities.Address.create({ label, address_line: line.trim() });
    setLine(""); setAdding(false); load();
  };

  const remove = async (id) => {
    await base44.entities.Address.delete(id); load();
  };

  const setAsDefault = (a) => setLocation({ label: a.label, line: a.address_line, coords: null });

  return (
    <MobileShell>
      <TopBar title="Saved addresses" subtitle="Home, work and others" />
      <div className="p-4 space-y-3 pb-8">
        {/* current */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-primary uppercase">Current / default</p>
          <p className="text-sm font-semibold text-foreground mt-1">{location.label}</p>
          <p className="text-xs text-muted-foreground">{location.line}</p>
        </div>

        {!addresses && <div className="grid place-items-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

        {addresses?.map((a) => (
          <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 text-slate-500"><MapPin className="w-5 h-5" /></span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.address_line}</p>
              </div>
              <button onClick={() => remove(a.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setAsDefault(a)} className="mt-2 w-full text-xs font-medium text-primary flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-primary/5">
              <Check className="w-3.5 h-3.5" /> Set as current location
            </button>
          </div>
        ))}

        {adding ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex gap-2">
              {LABELS.map((l) => (
                <button key={l} onClick={() => setLabel(l)} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${label === l ? "border-primary bg-primary/5 text-primary" : "border-slate-200 text-muted-foreground"}`}>{l}</button>
              ))}
            </div>
            <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="Full address" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium">Cancel</button>
              <button onClick={add} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Save</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium text-primary">
            <Plus className="w-4 h-4" /> Add new address
          </button>
        )}
      </div>
    </MobileShell>
  );
}