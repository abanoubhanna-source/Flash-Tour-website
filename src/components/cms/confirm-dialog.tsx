"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmState = { message: string; resolve: (value: boolean) => void };

// Replaces window.confirm() with an in-app dialog matching the dashboard's
// design, so confirmations never show the browser's native "site says" popup.
// Usage: const { confirm, dialog } = useConfirm(); ... if (!(await confirm("..."))) return; ... return <>{form}{dialog}</>;
export function useConfirm() {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setState({ message, resolve });
    });
  }, []);

  const respond = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  const dialog: ReactNode = state && (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => respond(false)}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
          </span>
          <p className="mt-1.5 text-sm font-bold text-slate-800">{state.message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => respond(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={() => respond(true)} className="h-10 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white hover:bg-[#106059]">Confirm</button>
        </div>
      </div>
    </div>
  );

  return { confirm, dialog };
}
