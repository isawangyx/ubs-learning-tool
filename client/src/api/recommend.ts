import { ProfilePayload } from './profile';
import { api } from '../lib/api';

export interface ModuleRec {
  id: string;
  title: string;
  duration: number;
  level: string;
}

export function fetchHybridReco(payload: ProfilePayload) {
  return api
    .post<ModuleRec[]>('/api/recommend/hybrid/', payload)
    .then((res) => res.data);
}