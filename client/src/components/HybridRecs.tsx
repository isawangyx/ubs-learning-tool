import React, { useState, useEffect } from 'react';
import { fetchHybridReco, ModuleRec } from '../api/recommend';
import { ProfilePayload } from '../api/profile';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4'>
      {modules.map((m) => (
        <Card key={m.id} className='hover:shadow-md transition p-2'>
          <CardContent className='space-y-1'>
            <h3 className='text-sm font-semibold whitespace-normal break-words'>
              {m.title}
            </h3>
            <div className='text-xs text-muted-foreground flex items-center space-x-1'>
              <span>{m.duration}h</span>
              <span aria-hidden='true'>•</span>
              <span> {m.level.replace(/level/gi, '').trim()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
