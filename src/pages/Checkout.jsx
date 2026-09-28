import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Check, Zap, Clock, ShieldCheck, Loader2 } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";
import { useLocation } from "@/lib/LocationContext";
import { getKit } from "@/lib/firsthourData";
import { base44 } from "@/api/base44Client";

export default function Checkout() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const kit = getKit(new URLSearchParams(window.location.search).get("kit"));
  const addons = kit.addons;
  const [selected, setSelected] = useState([]);
  const [payMode, setPayMode] = useState("instant");
  const [placing, setPlacing] = useState(false);

  const addonTotal = selected.reduce((s, id) => s + (addons.find((a) => a.id === id)?.price || 0), 0);
  const total = kit.price + addonTotal;

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const order = await base44.entities.Order.create({
        kit_name: kit.name,
        kit_price: kit.price,
        addons: addons.filter((a) => selected.includes(a.id)),
        total,
        fulfillment: "instant",
        status: "placed",
        eta_minutes: 10,
        address_line: location.line,
        payment_method: payMode === "instant" ? "Pay on delivery · UPI" : "UPI · Paid now",
      });
      navigate(`/track/${order.id}`);
    } catch (e) {
      setPlacing(false);
      alert("Could not place order. Try again.");
    }
  };

  return (
    <MobileShell showNav={false}>
      <TopBar title="Checkout" subtitle="Review and pay" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-40">
        {/* Address */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium uppercase">Deliver to</p>
              <p className="text-sm font-semibold text-foreground">{location.label}</p>
              <p className="text-xs text-muted-foreground">{location.line}</p>
            </div>
          </div>
        </div>

        {/* Kit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Your FirstHour kit</p>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-14 h-14 rounded-xl bg-emerald-50 text-3xl">{kit.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{kit.name}</p>
              <p className="text-xs text-muted-foreground">Target delivery within {kit.eta} min</p>
            </div>
            <span className="font-bold text-foreground">₹{kit.price}</span>
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <p className="text-sm font-bold text-foreground mb-2">You could also add</p>
          <div className="grid grid-cols-2 gap-2.5">
            {addons.map((a) => {
              const on = selected.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`relative text-left p-3 rounded-2xl border transition active:scale-[0.98] ${
                    on ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="block text-2xl mb-1">{a.emoji}</span>
                  <p className="text-xs font-semibold text-foreground leading-tight">{a.name}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">₹{a.price}</span>
                    <span
                      className={`grid place-items-center w-6 h-6 rounded-full transition ${
                        on ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {on ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment timing */}
        <div>
          <p className="text-sm font-bold text-foreground mb-2">Payment option</p>
          <div className="space-y-2">
            <button
              onClick={() => setPayMode("instant")}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
                payMode === "instant" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white"
              }`}
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                <Zap className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">Order Instantly</p>
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">RECOMMENDED</span>
                </div>
                <p className="text-xs text-muted-foreground">No payment now · pay once shipped, before delivery · ~10 min</p>
              </div>
              <span className="w-5 h-5 rounded-full border-2 border-primary grid place-items-center">
                {payMode === "instant" && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
            </button>
            <button
              onClick={() => setPayMode("pay_now")}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
                payMode === "pay_now" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-white"
              }`}
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-slate-100 text-slate-500">
                <Clock className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">Pay Now</p>
                <p className="text-xs text-muted-foreground">Pay to confirm, then it ships · ~10 min</p>
              </div>
              <span className="w-5 h-5 rounded-full border-2 border-slate-300 grid place-items-center">
                {payMode === "pay_now" && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </span>
            </button>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💳</span>
              <p className="text-sm font-semibold text-foreground">UPI · GPay</p>
            </div>
            <span className="text-xs text-primary font-medium">Default</span>
          </div>
        </div>
      </div>

      {/* Sticky pay bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Order total</p>
            <p className="text-xl font-bold text-foreground">₹{total}</p>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="flex-1 ml-4 bg-primary text-primary-foreground font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition disabled:opacity-60"
          >
            {placing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Placing…</>
            ) : payMode === "instant" ? (
              <>Place order · Pay on delivery</>
            ) : (
              <><ShieldCheck className="w-5 h-5" /> Pay & confirm</>
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Secure payment · cancel anytime before dispatch
        </p>
      </div>
    </MobileShell>
  );
}