"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { initialAuthActionState } from "@/lib/auth/types";
import { requestPasswordReset } from "./actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialAuthActionState);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <CheckCircle2 className="mb-3 h-6 w-6 text-emerald-600" />
        <p className="font-semibold">Check your inbox</p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#157670] focus:bg-white focus:ring-4 focus:ring-[#157670]/10"
            placeholder="name@flashtour.travel"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] text-sm font-bold text-white transition hover:bg-[#157670] focus:outline-none focus:ring-4 focus:ring-[#157670]/20 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Sending…" : "Send recovery link"}
      </button>
    </form>
  );
}
