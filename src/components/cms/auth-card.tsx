import Link from "next/link";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ eyebrow, title, description, children, footer }: AuthCardProps) {
  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#eef3f2] text-slate-900">
      <div className="relative flex min-h-full items-center justify-center overflow-hidden px-5 py-12">
        <div className="absolute left-[-8rem] top-[-8rem] h-96 w-96 rounded-full bg-[#157670]/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-[#f1b820]/10 blur-3xl" />

        <div className="relative w-full max-w-md">
          <Link href="/login" className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-black text-white">
              FT
            </div>
            <div>
              <p className="font-black tracking-tight text-[#0f172a]">FLASH TOUR</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#157670]">
                Website CMS
              </p>
            </div>
          </Link>

          <section className="rounded-[2rem] border border-white/80 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#157670]">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a]">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-8">{children}</div>
          </section>

          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </div>
    </main>
  );
}
