import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Loader2, ChevronRight } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import StatusPill from "@/components/StatusPill";
import { base44 } from "@/api/base44Client";

const STATUS_LABEL = {
  placed: "Placed",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};
const STATUS_TONE = { placed: "amber", packed: "primary", out_for_delivery: "primary", delivered: "green" };

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    base44.entities.Order.list("-created_date", 50).then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <MobileShell>
      <TopBar title="Order history" subtitle="Your FirstHour orders" />
      <div className="p-4 space-y-3 pb-8">
        {!orders && <div className="grid place-items-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
        {orders && orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">No orders yet.</p>
            <Link to="/" className="text-primary text-sm font-semibold mt-2 inline-block">Order your first kit</Link>
          </div>
        )}
        {orders?.map((o) => (
          <Link key={o.id} to={`/track/${o.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 active:scale-[0.99] transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🦶</span>
                <div>
                  <p className="font-semibold text-sm text-foreground">{o.kit_name}</p>
                  <p className="text-xs text-muted-foreground">₹{o.total} · {new Date(o.created_date).toLocaleDateString()}</p>
                </div>
              </div>
              <StatusPill status={STATUS_LABEL[o.status]} tone={STATUS_TONE[o.status]} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{o.fulfillment === "instant" ? "Instant delivery" : "Standard"}</span>
              <span className="inline-flex items-center gap-1 text-primary font-medium">Track <ChevronRight className="w-3 h-3" /></span>
            </div>
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}