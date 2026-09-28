import React, { useState } from "react";
import { Bell, Globe, ShieldCheck, Moon, Trash2, Clock } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { Switch } from "@/components/ui/switch";

function Row({ icon: Icon, title, desc, children }) {
  return (
    <div className="flex items-center gap-3 p-4 border-t border-slate-100 first:border-t-0">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 text-slate-500"><Icon className="w-5 h-5" /></span>
      <div className="flex-1">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  const [eta, setEta] = useState(true);

  return (
    <MobileShell>
      <TopBar title="Settings" subtitle="Preferences and account" />
      <div className="p-4 space-y-4 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <Row icon={Bell} title="Push notifications" desc="Order and ambulance updates"><Switch checked={notif} onCheckedChange={setNotif} /></Row>
          <Row icon={Clock} title="ETA reminders" desc="Notify before delivery"><Switch checked={eta} onCheckedChange={setEta} /></Row>
          <Row icon={Moon} title="Dark mode" desc="Easier on the eyes at night"><Switch checked={dark} onCheckedChange={setDark} /></Row>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <Row icon={Globe} title="Language" desc="English"><span className="text-sm text-primary font-medium">Change</span></Row>
          <Row icon={ShieldCheck} title="Privacy" desc="Location and data permissions"><span className="text-sm text-primary font-medium">Manage</span></Row>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 bg-red-50 text-sm font-medium text-red-500">
          <Trash2 className="w-4 h-4" /> Delete account
        </button>
      </div>
    </MobileShell>
  );
}