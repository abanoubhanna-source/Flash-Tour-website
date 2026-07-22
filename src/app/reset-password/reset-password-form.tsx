"use client";

import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { initialAuthActionState } from "@/lib/auth/types";
import { updatePassword } from "./actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {[
        { id: "password", label: "New password", autocomplete: "new-password" },
        { id: "confirmPassword", label: "Confirm password", autocomplete: "new-password" },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {field.label}
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id={field.id}
              name={field.id}
              type="password"
              autoComplete={field.autocomplete}
              required
              minLength={12}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#157670] focus:bg-white focus:ring-4 focus:ring-[#157670]/10"
            />
          </div>
        </div>
      ))}
      <button
        type="submit"
        disabled={pending}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] text-sm font-bold text-white transition hover:bg-[#157670] focus:outline-none focus:ring-4 focus:ring-[#157670]/20 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
