import { ProfilePayload } from './profile';
import { api } from '../lib/api';

export interface ModuleRec {
  id: string;
  title: string;
  duration: number;
  level: string;
}

export function fetchColdStartReco(payload: ProfilePayload) {
  return api
    .post<ModuleRec[]>('/api/recommend/cold_start/', payload)
    .then((res) => res.data);
}
