import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../clients";
import { ORGANIZATION } from "../../endpoints/organization/org";

// ─── Types ─────────────────────────────────────────────────────────────────
type RequestAction = "accept" | "reject";
type EmployeePosition = "CEO" | "COO" | "CFO" | "CTO" | "MANAGER" | "TEAM_LEAD" | "STAFF";

interface OrgListItem {
  _id: string;
  organization: string;
  location: string;
  businessSector: string;
  employeeRange: string;
}

interface JoinRequestPayload {
  organizationId: string;
  message?: string;
}

interface OrganizationRequest {
  _id: string;
  employeeId: { _id: string; fullName: string; email: string } | string;
  organizationId: { _id: string; organization: string; location: string; businessSector: string } | string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  message: string;
  createdAt: string;
}

interface Employee {
  _id: string;
  fullName: string;
  email: string;
  position: string;
  createdAt: string;
}

// ─── Query keys ───────────────────────────────────────────────────────────
export const ORG_KEYS = {
  list: ["organizations"],
  incoming: ["organization-requests", "incoming"],
  mine: ["organization-requests", "mine"],
  employees: ["organization", "employees"],
};

// ─── List all organizations (employee browses to pick one) ────────────────
export const useListOrganizations = () => {
  return useQuery({
    queryKey: ORG_KEYS.list,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: OrgListItem[] }>(
        ORGANIZATION.LIST_ORGANIZATIONS
      );
      return data.data;
    },
  });
};

// ─── Employee sends a join request ────────────────────────────────────────
export const useRequestJoinOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: JoinRequestPayload) => {
      const { data } = await api.post(ORGANIZATION.REQUEST_JOIN, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.mine });
    },
  });
};

// ─── Employee views their own request history ─────────────────────────────
export const useMyRequests = () => {
  return useQuery({
    queryKey: ORG_KEYS.mine,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: OrganizationRequest[] }>(
        ORGANIZATION.MY_REQUESTS
      );
      return data.data;
    },
  });
};

// ─── Organization views incoming requests ─────────────────────────────────
export const useIncomingRequests = (status: "PENDING" | "ACCEPTED" | "REJECTED" = "PENDING") => {
  return useQuery({
    queryKey: [...ORG_KEYS.incoming, status],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: OrganizationRequest[] }>(
        `${ORGANIZATION.GET_INCOMING_REQUESTS}?status=${status}`
      );
      return data.data;
    },
  });
};

// ─── Organization accepts or rejects a request ───────────────────────────
export const useRespondToRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: RequestAction }) => {
      const { data } = await api.patch(ORGANIZATION.RESPOND_TO_REQUEST(id), { action });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.incoming });
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.employees });
    },
  });
};

// ─── Organization views all its employees ────────────────────────────────
export const useOrganizationEmployees = () => {
  return useQuery({
    queryKey: ORG_KEYS.employees,
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Employee[] }>(
        ORGANIZATION.ALL_EMPLOYEES
      );
      return data.data;
    },
  });
};

// ─── Organization promotes an employee ───────────────────────────────────
export const usePromoteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, position }: { employeeId: string; position: EmployeePosition }) => {
      const { data } = await api.patch(ORGANIZATION.PROMOTE_EMPLOYEE(employeeId), { position });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.employees });
    },
  });
};

// ─── Organization removes an employee ────────────────────────────────────
export const useRemoveEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      const { data } = await api.delete(ORGANIZATION.REMOVE_EMPLOYEE(employeeId));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_KEYS.employees });
    },
  });
};