import { api } from '../lib/api';

export type ProgressEvent = 'view' | 'chapter' | 'complete';

export interface ProgressPayload {
  module_id: number;
  event_type: ProgressEvent;
  grade?: number;
  certified?: boolean;
}

export interface ProgressResponse {
  start_time: string;
  last_event: string;
  ndays_act: number;
  nchapters: number;
  grade: number;
  certified: boolean;
}

export async function updateProgress(
  payload: ProgressPayload
): Promise<ProgressResponse> {
  const token = localStorage.getItem('token');
  const response = await api.post<ProgressResponse>(
    '/api/progress/update/',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export interface ProgressPoint {
  date: string;
  ndays_act: number;
  nchapters: number;
}

export function fetchProgressHistory(): Promise<ProgressPoint[]> {
  return api
    .get<ProgressPoint[]>('/api/progress/history/')
    .then((res) => res.data);
}

export interface Certified {
  id: number;
  module: {
    id: number;
    title: string;
  };
  grade: number;
  last_event: string;
  ndays_act: number;
  nchapters: number;
  certified: boolean;
}

export function fetchCertifiedModules(): Promise<Certified[]> {
  return api.get<Certified[]>('/api/progress/?certified=true').then((res) => res.data);
}
