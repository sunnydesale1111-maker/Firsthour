import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, subtitle, back = true, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-slate-100">
      <div className="flex items-center gap-2 px-3 py-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 transition shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {title && <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}