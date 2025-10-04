import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  company: ["create", "manage"],
  user: ["view", "manage"],
  role: ["manage"],
  approvalRule: ["view", "manage"],
  expense: [
    "create",
    "view",
    "viewAll",
    "approve",
    "reject",
    "override",
    "escalate",
  ],
} as const;

const ac = createAccessControl(statement);

// Employee: Submit expenses, view their own expenses, check approval status
const employee = ac.newRole({
  expense: ["create", "view"],
});

// Manager: Approve/reject expenses, view team expenses, escalate as per rules
const manager = ac.newRole({
  expense: ["create", "view", "approve", "reject", "escalate"],
});

// Admin: Create company (auto on signup), manage users, set roles,
// configure approval rules, view all expenses, override approvals
const admin = ac.newRole({
  company: ["create", "manage"],
  user: ["view", "manage"],
  role: ["manage"],
  approvalRule: ["view", "manage"],
  expense: [
    "create",
    "view",
    "viewAll",
    "approve",
    "reject",
    "override",
    "escalate",
  ],
});

export { ac, employee, manager, admin };
