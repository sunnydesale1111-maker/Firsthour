import React from "react";
import BottomNav from "@/components/BottomNav";

export default function MobileShell({ children, showNav = true, className = "" }) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center">
      <div
        className={`relative w-full max-w-md min-h-screen bg-background shadow-2xl shadow-slate-300/50 flex flex-col ${className}`}
      >
        <div className="flex-1 flex flex-col">{children}</div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}