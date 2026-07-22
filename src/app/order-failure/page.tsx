"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function OrderFailurePage() {
  const [reason, setReason] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReason(params.get("reason") || "");
    setCode(params.get("code") || "");
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-[#aea3cf]/95 rounded-[2rem] shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-500" strokeWidth={2.5} />
        </div>
        <h1 className="font-serif font-normal text-4xl md:text-5xl text-slate-900 mb-4 tracking-tight">Payment Failed</h1>
        <p className="text-slate-700 mb-6 leading-relaxed font-sans text-base">
          Unfortunately, your payment could not be processed. Don&apos;t worry, your items are still in your cart. Please try again or use a different payment method.
        </p>

        {/* The exact reason returned by the payment gateway, when available. */}
        {reason && (
          <div className="mb-8 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-left">
            <p className="font-sans text-sm text-red-800">
              <span className="font-bold">Reason:</span> {reason}
            </p>
            {code && (
              <p className="font-sans text-xs text-red-600 mt-1">Code: {code}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="w-full bg-[#111] text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Try Again
          </Link>
          <Link
            href="/products"
            className="w-full bg-transparent text-slate-900 font-bold text-sm tracking-widest uppercase py-4 rounded-xl border-2 border-slate-900/40 hover:border-slate-900 hover:bg-slate-900/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
