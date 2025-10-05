"use client";

import useRole, { ROLES } from "@/hooks/useRole";

const RoleSwitcher = () => {
  const { role, setRole } = useRole();

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">Role:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="text-sm rounded border px-2 py-1"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
