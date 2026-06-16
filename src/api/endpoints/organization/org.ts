export const ORGANIZATION = {
  // Browsing & requesting
  LIST_ORGANIZATIONS: "/organization",
  REQUEST_JOIN: "/organization/request",
  GET_INCOMING_REQUESTS: "/organization/incoming",
  MY_REQUESTS: "/organization/mine",
  RESPOND_TO_REQUEST: (id: string) => `/organization/${id}/respond`,

  // Employee management (org-side)
  ALL_EMPLOYEES: "/organization/employees",
  PROMOTE_EMPLOYEE: (employeeId: string) => `/employees/${employeeId}/position`,
  REMOVE_EMPLOYEE: (employeeId: string) => `/employees/${employeeId}`,
};