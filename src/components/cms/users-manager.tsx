"use client";

import { useMemo, useState, useTransition } from "react";
import { UserPlus, X } from "lucide-react";
import { assignCmsRole, inviteCmsUser, removeCmsRole, updateCmsUserStatus } from "@/app/dashboard/users/actions";

type Role = { id: string; name: string; key: string; rank: number };
type Profile = {
  id: string;
  display_name: string;
  email: string | null;
  status: "active" | "suspended";
  user_roles: { role_id: string; roles: { name: string; key: string; rank: number } | null }[];
};

function initialFor(profile: Profile) {
  const source = profile.display_name || profile.email || "?";
  return source.trim().charAt(0).toUpperCase();
}

function InviteForm({ roles, onInvited }: { roles: Role[]; onInvited: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit() {
    if (!email.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await inviteCmsUser({ email, displayName, roleId: roleId || null });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onInvited(result.message);
      setEmail("");
      setDisplayName("");
      setRoleId("");
    });
  }

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Add a user</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">Invite a CMS user</h3>
      <p className="mt-1 text-xs text-slate-500">Sends an email invitation. They set their own password and MFA the first time they sign in.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
        <input
          type="email"
          aria-label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@company.com"
          className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8"
        />
        <input
          aria-label="Display name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Display name (optional)"
          className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-[#157670] focus:ring-4 focus:ring-[#157670]/8"
        />
        <select
          aria-label="Initial role"
          value={roleId}
          onChange={(event) => setRoleId(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#157670]"
        >
          <option value="">No role yet</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending || !email.trim()}
          onClick={submit}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#157670] px-4 text-xs font-bold text-white disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {pending ? "Sending…" : "Send invite"}
        </button>
      </div>
      {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    </section>
  );
}

function RoleChip({ name, onRemove }: { name: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#157670]/10 py-1 pl-3 pr-1.5 text-[11px] font-bold text-[#157670]">
      {name}
      {onRemove && (
        <button type="button" aria-label={`Remove ${name} role`} onClick={onRemove} className="rounded-full p-0.5 hover:bg-[#157670]/20">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

function UserRow({ profile, roles, canManage, onNotice }: { profile: Profile; roles: Role[]; canManage: boolean; onNotice: (message: string) => void }) {
  const [pending, startTransition] = useTransition();
  const assignedRoleIds = new Set(profile.user_roles.map((assignment) => assignment.role_id));
  const availableRoles = roles.filter((role) => !assignedRoleIds.has(role.id));

  function assign(roleId: string) {
    startTransition(async () => {
      const result = await assignCmsRole({ userId: profile.id, roleId });
      onNotice(result.message);
    });
  }

  function remove(roleId: string, roleName: string) {
    if (!window.confirm(`Remove the ${roleName} role from ${profile.display_name || profile.email}?`)) return;
    startTransition(async () => {
      const result = await removeCmsRole({ userId: profile.id, roleId });
      onNotice(result.message);
    });
  }

  function toggleStatus() {
    const next = profile.status === "active" ? "suspended" : "active";
    if (next === "suspended" && !window.confirm(`Suspend ${profile.display_name || profile.email}? They will immediately lose dashboard access.`)) return;
    startTransition(async () => {
      const result = await updateCmsUserStatus({ userId: profile.id, status: next });
      onNotice(result.message);
    });
  }

  return (
    <article className="flex flex-wrap items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
        {initialFor(profile)}
      </div>
      <div className="min-w-56 flex-1">
        <p className="text-sm font-bold text-slate-900">{profile.display_name || profile.email || "Unnamed CMS user"}</p>
        {profile.display_name && profile.email && <p className="text-xs text-slate-500">{profile.email}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${profile.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {profile.status}
          </span>
          {profile.user_roles.length === 0 && <span className="text-[11px] text-slate-400">No role</span>}
          {profile.user_roles.map((assignment) => assignment.roles && (
            <RoleChip key={assignment.role_id} name={assignment.roles.name} onRemove={canManage ? () => remove(assignment.role_id, assignment.roles!.name) : undefined} />
          ))}
        </div>
      </div>
      {canManage && (
        <div className="flex items-center gap-2">
          {availableRoles.length > 0 && (
            <select
              disabled={pending}
              defaultValue=""
              aria-label={`Assign a role to ${profile.display_name || profile.email}`}
              onChange={(event) => {
                const roleId = event.target.value;
                if (!roleId) return;
                assign(roleId);
                event.target.value = "";
              }}
              className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#157670]"
            >
              <option value="">+ Add role…</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={toggleStatus}
            className={`rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-50 ${profile.status === "active" ? "border-red-200 text-red-700 hover:bg-red-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
          >
            {profile.status === "active" ? "Suspend" : "Activate"}
          </button>
        </div>
      )}
    </article>
  );
}

export function UsersManager({ profiles, roles, canManage }: { profiles: Profile[]; roles: Role[]; canManage: boolean }) {
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return profiles;
    return profiles.filter((profile) => (profile.display_name || "").toLowerCase().includes(query) || (profile.email || "").toLowerCase().includes(query));
  }, [profiles, search]);

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#157670]">Access control</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">Users &amp; roles</h2>
        <p className="mt-1 text-sm text-slate-500">Role assignments and account status respect database RLS. Invitations are sent by email and require no password to be shared.</p>
        {notice && <p role="status" className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{notice}</p>}
      </section>

      {canManage && <InviteForm roles={roles} onInvited={setNotice} />}

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-700">{filtered.length} of {profiles.length} users</p>
          <input
            type="search"
            aria-label="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            className="h-9 w-56 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#157670]"
          />
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((profile) => (
            <UserRow key={profile.id} profile={profile} roles={roles} canManage={canManage} onNotice={setNotice} />
          ))}
          {!filtered.length && <p className="p-8 text-center text-sm text-slate-500">{profiles.length ? "No users match your search." : "No CMS profiles found."}</p>}
        </div>
      </section>
    </div>
  );
}
