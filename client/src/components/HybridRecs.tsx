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
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
      {modules.map((m) => (
        <Card key={m.id} className='hover:shadow-xl transition'>
          <CardContent className='p-4 space-y-2'>
            <h3 className='text-lg font-semibold'>{m.title}</h3>
            <div className='text-sm text-muted-foreground'>
              Duration: {m.duration} hrs
            </div>
            <div className='text-sm text-muted-foreground'>
              Level: {m.level}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
