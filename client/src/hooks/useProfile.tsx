import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function useProfile() {
    const [profile, setProfile] = useState<any>(null);
    useEffect(() => {
      api.get("/api/profile/me/").then(res => setProfile(res.data));
    }, []);
    return profile;
  }

