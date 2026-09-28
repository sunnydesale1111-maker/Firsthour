import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Package, MapPin, Ambulance, LifeBuoy, Settings, LogOut, ShieldCheck } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import LocationBar from "@/components/LocationBar";
import { base44 } from "@/api/base44Client";

const MENU = [
  { to: "/orders", label: "Order history", icon: Package, desc: "Previous FirstHour orders" },
  { to: "/addresses", label: "Saved addresses", icon: MapPin, desc: "Home, work and others" },
  { to: "/ambulance-history", label: "Ambulance history", icon: Ambulance, desc: "Medical assistance requests" },
  { to: "/support", label: "Help & support", icon: LifeBuoy, desc: "Get help with an order" },
  { to: "/settings", label: "Settings", icon: Settings, desc: "Preferences and account" },
];

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const logout = () => base44.auth.logout("/login");

  return (
    <MobileShell>
      <LocationBar />
      <div className="p-4 space-y-5 pb-8">
        {/* Profile summary */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-white/20 text-2xl font-bold">
              {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-bold text-lg truncate">{user?.full_name || "Betterhood user"}</p>
              <p className="text-sm text-emerald-50 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-50">
            <ShieldCheck className="w-4 h-4" /> Verified account
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {MENU.map(({ to, label, icon: Icon, desc }, i) => (
            <Link key={to} to={to} className={`flex items-center gap-3 p-4 hover:bg-slate-50 transition ${i > 0 ? "border-t border-slate-100" : ""}`}>
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary"><Icon className="w-5 h-5" /></span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-red-500">
          <LogOut className="w-4 h-4" /> Log out
        </button>

        <p className="text-center text-xs text-muted-foreground">FirstHour by Betterhood · v1.1</p>
      </div>
    </MobileShell>
  );
}