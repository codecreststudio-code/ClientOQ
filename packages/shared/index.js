const ROLES = {
  SUPER_ADMIN: "SuperAdmin",
  OWNER: "Owner",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
  CLIENT: "Client"
};

const LEAD_STATUSES = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost"
};

const PROJECT_STATUSES = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
  ARCHIVED: "Archived"
};

const TASK_STATUSES = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed"
};

const INVOICE_STATUSES = {
  DRAFT: "Draft",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled"
};

module.exports = {
  ROLES,
  LEAD_STATUSES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  INVOICE_STATUSES
};
