// src/api/profile.ts
import { api } from '../lib/api'; // your shared Axios instance

export interface ProfilePayload {
  career_stage: string;
  skills: string[];
  goals: string[];
  weekly_availability: Record<string, number>;
  preferred_content: string[];
}

export function saveProfile(data: ProfilePayload, token: string) {
  return api.post('/api/profile/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchProfile(token: string) {
  return api.get<ProfilePayload>('/api/profile/me/', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
