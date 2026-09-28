import React, { useState } from "react";
import { MapPin, ChevronDown, LocateFixed, Loader2, Check } from "lucide-react";
import { useLocation } from "@/lib/LocationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LocationBar({ compact = false }) {
  const { location, setLocation, detecting, detect } = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const save = () => {
    if (draft.trim()) {
      setLocation({ label: draft.trim().slice(0, 40), line: draft.trim(), coords: null });
    }
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="grid place-items-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
          {detecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            {detecting ? "Detecting location…" : "Deliver to"}
          </span>
          <span className="block text-sm font-semibold text-foreground truncate">
            {location.label}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm your location</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <button
              onClick={() => { detect(); setOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition"
            >
              <LocateFixed className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Use my current location (GPS)</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-xs text-emerald-800">Detected: {location.label}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">Or enter it manually</p>
            <Input
              placeholder="Enter area / address"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button onClick={save} className="w-full">Confirm location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}