import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export interface ProfilePayload {
  id: number;
  username: string;
  career_stage: string;
  skills: string[];
  goals: string[];
  weekly_availability: Record<string, string>; 
  preferred_content: string[];
}

export function useProfile() {
  const { access } = useAuth();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if no token 
    if (!access) {
      setLoading(false);
      return;
    }

 
    setLoading(true);
    api
      .get<ProfilePayload>('/api/profile/me/')
      .then((res) => {
        setProfile(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setError(err.response?.data?.detail || err.message);
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [access]);

  return { profile, loading, error };
}