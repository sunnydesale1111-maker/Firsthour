import React from "react";
import { Phone, MessageSquare, Mail, LifeBuoy, Ambulance } from "lucide-react";
import MobileShell from "@/components/MobileShell";
import TopBar from "@/components/TopBar";

const FAQS = [
  { q: "What's inside the FirstHour kit?", a: "Instant cold pack, ankle compression wrap, protective barrier layer, visual instruction card, QR usage guide and red-flag guidance." },
  { q: "Is the 10-minute delivery guaranteed?", a: "It's a target shown only in serviceable areas. We show the real ETA if 10 minutes isn't supportable." },
  { q: "When should I use the ambulance option?", a: "When you believe professional medical help is needed — severe pain, deformity, heavy bleeding, or inability to bear weight." },
  { q: "Can I cancel an order?", a: "Yes, you can cancel anytime before dispatch from the order tracking screen." },
];

export default function Support() {
  return (
    <MobileShell>
      <TopBar title="Help & support" subtitle="We're here to help" />
      <div className="p-4 space-y-4 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <LifeBuoy className="w-7 h-7" />
          <p className="font-bold text-lg mt-2">Need help fast?</p>
          <p className="text-sm text-emerald-50">For emergencies, use the ambulance option or call 112.</p>
          <a href="/ambulance" className="mt-3 inline-flex items-center gap-2 bg-white text-red-500 font-semibold text-sm px-4 py-2.5 rounded-xl">
            <Ambulance className="w-4 h-4" /> Go to ambulance
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <a href="tel:+911234567890" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-slate-200 bg-white">
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Call</span>
          </a>
          <a href="sms:+911234567890" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-slate-200 bg-white">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Message</span>
          </a>
          <a href="mailto:help@betterhood.in" className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border border-slate-200 bg-white">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Email</span>
          </a>
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-bold text-foreground">Frequently asked</p>
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4 group">
              <summary className="font-semibold text-sm text-foreground cursor-pointer flex justify-between items-center list-none">
                {f.q} <span className="text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}