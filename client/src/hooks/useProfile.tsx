import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useProfile() {
    interface Profile {
        id: string;
        name: string;
        email: string;
        career_stage: string;
        skills: string[];
        goals: string[];
        weekly_availability: Record<string, string>;
        preferred_content: string[];
    }

    const [profile, setProfile] = useState<Profile | null>(null);
    useEffect(() => {
      api.get('/api/profile/me/').then(res => setProfile(res.data));
    }, []);
    return profile;
  }

