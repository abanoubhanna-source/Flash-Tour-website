"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { initialAuthActionState } from "@/lib/auth/types";
import { verifyMfa } from "./actions";

export function MfaForm({ factorId, nextPath }: { factorId: string; nextPath?: string }) {
  const [state, formAction, pending] = useActionState(verifyMfa, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="factorId" value={factorId} />
      <input type="hidden" name="next" value={nextPath ?? "/dashboard"} />
      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      <div>
        <label htmlFor="code" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Authentication code
        </label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            autoFocus
            minLength={6}
            maxLength={6}
            pattern="[0-9]{6}"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-center text-xl font-bold tracking-[0.35em] outline-none transition focus:border-[#157670] focus:bg-white focus:ring-4 focus:ring-[#157670]/10"
            placeholder="000000"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] text-sm font-bold text-white transition hover:bg-[#157670] focus:outline-none focus:ring-4 focus:ring-[#157670]/20 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Verifying…" : "Verify and continue"}
      </button>
    </form>
  );
}
