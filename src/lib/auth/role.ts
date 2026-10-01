// lib/auth/role.ts

import { UserRole } from "../types/common.types";

export const roleDashboard = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    ADMIN: "/admin",
    SELLER: "/seller",
    CUSTOMER: "/customer",
  };
  return map[role] ?? "/";
};
