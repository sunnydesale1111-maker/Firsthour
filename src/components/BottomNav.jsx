import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Ambulance, User } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/ambulance", label: "Ambulance", icon: Ambulance },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200">
      <div className="grid grid-cols-4">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.4]" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}