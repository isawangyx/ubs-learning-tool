import React, { useState, useEffect } from 'react';
import { fetchHybridReco, ModuleRec } from '../api/recommend';
import { ProfilePayload } from '../api/profile';

export default function HybridRecs({
  userProfile,
}: {
  userProfile: ProfilePayload;
}) {
  const [modules, setModules] = useState<ModuleRec[]>([]);
  const [error, setError] = useState(null);

  if (!userProfile) {
    return <div>Loading your profile…</div>;
  }

  useEffect(() => {
    if (!userProfile) {
      return;
    }
    console.log('calling hybrid reco with profile:', userProfile);
    // only run for new users
    fetchHybridReco({
      career_stage: userProfile.career_stage,
      skills: userProfile.skills,
      goals: userProfile.goals,
      weekly_availability: userProfile.weekly_availability,
      preferred_content: userProfile.preferred_content,
    })
      .then(setModules)
      .catch((err) => setError(err.message));
  }, [userProfile]);

  if (error) return <div>Error: {error}</div>;
  if (!modules.length) return <div>Loading recommendations…</div>;

  return (
    <div>
      <ul>
        {modules.map((m) => (
          <li key={m.id}>
            <strong>{m.title}</strong> — {m.duration} hrs — {m.level}
          </li>
        ))}
      </ul>
    </div>
  );
}
