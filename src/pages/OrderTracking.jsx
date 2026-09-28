import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Clock, MapPin, Phone, ShieldCheck, Home, Loader2 } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { ORDER_FLOW } from "@/lib/firsthourData";
import { base44 } from "@/api/base44Client";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const o = await base44.entities.Order.get(orderId);
        setOrder(o);
        sub = base44.entities.Order.subscribe((event) => {
          if (event.id === orderId) setOrder(event.data);
        });
      } catch {
      } finally {
        setLoading(false);
      }
    })();
    return () => sub && sub();
  }, [orderId]);

  // simulate progression
  useEffect(() => {
    if (!order || order.status === "delivered") return;
    const orderIdx = ORDER_FLOW.findIndex((s) => s.key === order.status);
    const next = ORDER_FLOW[orderIdx + 1];
    if (!next) return;
    const t = setTimeout(async () => {
      try {
        const updated = await base44.entities.Order.update(order.id, { status: next.key });
        setOrder(updated);
      } catch {}
    }, 6000);
    return () => clearTimeout(t);
  }, [order]);

  if (loading) {
    return (
      <MobileShell showNav={false}>
        <TopBar title="Order tracking" />
        <div className="grid place-items-center py-20"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
      </MobileShell>
    );
  }

  if (!order) {
    return (
      <MobileShell showNav={false}>
        <TopBar title="Order tracking" />
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Order not found.</p>
          <Link to="/" className="text-primary text-sm font-semibold mt-2 inline-block">Back home</Link>
        </div>
      </MobileShell>
    );
  }

  const currentIdx = ORDER_FLOW.findIndex((s) => s.key === order.status);
  const progress = ((currentIdx + 1) / ORDER_FLOW.length) * 100;

  return (
    <MobileShell showNav={false}>
      <TopBar title="Order tracking" subtitle={order.kit_name} />
      <div className="p-4 space-y-5 pb-8">
        {/* ETA banner */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <div className="flex items-center gap-2 text-emerald-50 text-xs font-medium uppercase tracking-wide">
            <Clock className="w-4 h-4" /> {order.fulfillment === "instant" ? "Arriving in" : "Scheduled"}
          </div>
          <p className="text-3xl font-bold mt-1">
            {order.status === "delivered" ? "Delivered" : `~${order.eta_minutes} min`}
          </p>
          <p className="text-sm text-emerald-50 mt-1">{order.address_line}</p>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-foreground mb-3">Order status</p>
          <div className="h-1.5 rounded-full bg-slate-100 mb-4 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="space-y-3">
            {ORDER_FLOW.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className={`grid place-items-center w-8 h-8 rounded-full text-sm transition ${done ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-400"}`}>
                    {done ? "✓" : s.emoji}
                  </span>
                  <span className={`text-sm ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
                  {i === currentIdx && <span className="ml-auto text-[10px] font-semibold text-primary">NOW</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-bold text-foreground mb-2">Order summary</p>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">{order.kit_name}</span><span className="font-medium">₹{order.kit_price}</span></div>
          {order.addons?.map((a) => (
            <div key={a.id} className="flex justify-between text-sm mt-1"><span className="text-muted-foreground">+ {a.name}</span><span className="font-medium">₹{a.price}</span></div>
          ))}
          <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between"><span className="font-bold">Total</span><span className="font-bold">₹{order.total}</span></div>
          <p className="text-xs text-muted-foreground mt-2">Paid via {order.payment_method} · {order.fulfillment === "instant" ? "Instant delivery" : "Standard"}</p>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <Phone className="w-4 h-4" /> Support
          </button>
          <button onClick={() => navigate("/")} className="flex-1 rounded-2xl bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 text-sm font-semibold">
            <Home className="w-4 h-4" /> Done
          </button>
        </div>
      </div>
    </MobileShell>
  );
}