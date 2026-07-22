export type CmsRole = {
  key: string;
  name: string;
  rank: number;
};

export type CmsUser = {
  id: string;
  email: string;
  displayName: string;
  initials: string;
  roles: CmsRole[];
  primaryRole: CmsRole;
  permissions: string[];
};

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};
