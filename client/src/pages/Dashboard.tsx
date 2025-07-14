import { useEffect, useState } from 'react';
import HybridRecs from '../components/HybridRecs';
import { useProfile } from '../hooks/useProfile';
import {
  fetchInProgressModules,
  fetchProgressStats,
  ProgressStats,
} from '../api/progress';
import { Spinner } from '@/components/ui/spinner';
import { Certified } from '../api/progress';
import { AcademicCapIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import CountUp from 'react-countup';
import { InProgressList } from '@/components/InProgressList';

export function Dashboard() {
  const { profile, loading, error } = useProfile();
  const [inProgress, setInProgress] = useState<Certified[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setStatsLoading(true);
    setStatsError(null);

    fetchProgressStats()
      .then((data) => {
        setStats(data);
        return fetchInProgressModules();
      })
      .then(setInProgress)
      .catch((err) => {
        setStatsError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setStatsLoading(false));
  }, [profile]);

  if (loading || statsLoading) return <Spinner />;
  if (error || statsError)
    return <div className='text-red-500'>Error: {error}</div>;
  if (!profile) return <div>Profile not found.</div>;

  const weeklyAvailabilityNums = Object.fromEntries(
    Object.entries(profile.weekly_availability).map(([day, hrs]) => [
      day,
      Number(hrs) || 0,
    ])
  );

  const userProfileForReco = {
    ...profile,
    weekly_availability: weeklyAvailabilityNums,
  };

  console.log('userProfileForReco:', userProfileForReco);

  return (
    <div className='max-w-5xl mx-auto px-6 py-10 space-y-12'>
      <h1 className='text-3xl font-bold'>
        Welcome back,{' '}
        <span className='text-purple-500'>{profile.username}</span>!
      </h1>

      <section>
        <h2 className='text-xl font-semibold mb-4'>Overview</h2>
        <div className='flex flex-col sm:flex-row gap-6'>
          <div className='flex-1 bg-white p-6 rounded-lg shadow flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>In Progress</p>
              <p className='text-3xl font-bold'>
                <CountUp end={stats?.in_progress_count ?? 0} duration={1.5} />
              </p>
            </div>
            <AcademicCapIcon className='w-10 h-10 text-indigo-500' />
          </div>
          <div className='flex-1 bg-white p-6 rounded-lg shadow flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Certifications</p>
              <p className='text-3xl font-bold'>
                <CountUp end={stats?.certified_count ?? 0} duration={1.5} />
              </p>
            </div>
            <CheckBadgeIcon className='w-10 h-10 text-green-500' />
          </div>
        </div>
      </section>

      <InProgressList inProgress={inProgress} />
      <section>
        <h2 className='text-xl font-semibold mb-4'>Recommended for you</h2>
        <HybridRecs userProfile={userProfileForReco} />
      </section>
    </div>
  );
}
