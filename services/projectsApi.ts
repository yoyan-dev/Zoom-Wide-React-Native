import { apiRequest } from "@/services/apiClient";
import type { Project, ProjectItem } from "@/types/project";

type FetchProjectsParams = {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
};

type ProjectPayload = {
  name: string;
  location?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: Project["status"];
  progress?: number;
  budget?: number;
};

type CreateProjectItemPayload = {
  product_id: string;
  quantity: number;
  unit_price?: number;
};

function toQueryString(params: FetchProjectsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function fetchProjects(accessToken: string, params?: FetchProjectsParams) {
  return apiRequest<Project[]>(`/projects${toQueryString(params)}`, {
    accessToken,
    method: "GET",
  });
}

export function fetchProjectById(accessToken: string, projectId: string) {
  return apiRequest<Project>(`/projects/${projectId}`, {
    accessToken,
    method: "GET",
  });
}

export function createProject(accessToken: string, payload: ProjectPayload) {
  return apiRequest<Project>("/projects", {
    accessToken,
    body: payload,
    method: "POST",
  });
}

export function updateProject(
  accessToken: string,
  projectId: string,
  payload: Partial<ProjectPayload>,
) {
  return apiRequest<Project>(`/projects/${projectId}`, {
    accessToken,
    body: payload,
    method: "PATCH",
  });
}

export function fetchProjectItems(accessToken: string, projectId: string) {
  return apiRequest<ProjectItem[]>(`/projects/${projectId}/items`, {
    accessToken,
    method: "GET",
  });
}

export function createProjectItem(
  accessToken: string,
  projectId: string,
  payload: CreateProjectItemPayload,
) {
  return apiRequest<ProjectItem>(`/projects/${projectId}/items`, {
    accessToken,
    body: payload,
    method: "POST",
  });
}

export function updateProjectItem(
  accessToken: string,
  projectId: string,
  itemId: string,
  quantity: number,
) {
  return apiRequest<ProjectItem>(`/projects/${projectId}/items/${itemId}`, {
    accessToken,
    body: { quantity },
    method: "PATCH",
  });
}

export function deleteProjectItem(
  accessToken: string,
  projectId: string,
  itemId: string,
) {
  return apiRequest<unknown>(`/projects/${projectId}/items/${itemId}`, {
    accessToken,
    method: "DELETE",
  });
}
