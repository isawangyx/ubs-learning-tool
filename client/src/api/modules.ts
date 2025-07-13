import { api } from '../lib/api';

export interface Module {
  id: number;
  title: string;
  duration: number; // in hours
  skill_tags: string[];
  goal_tags: string[];
  level: string;
  avg_rating: number;
  review_count: number;
}

export interface PaginatedModules {
  count: number;
  next: string | null;
  previous: string | null;
  results: Module[];
}

export async function fetchModules(
  page: number,
  pageSize = 12,
  search?: string
): Promise<PaginatedModules> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (search) {
    params.set('search', search);
  }
  return api
    .get<PaginatedModules>(`/api/modules/?${params.toString()}`)
    .then((res) => res.data);
}

export function fetchModuleById(id: number): Promise<Module> {
  return api.get<Module>(`/api/modules/${id}/`).then((res) => res.data);
}
