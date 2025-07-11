import HybridRecs from '../components/HybridRecs';
import { useProfile } from '../hooks/useProfile';
import { ProgressChart } from '../components/ProgressChart';

export function Dashboard() {
  const { profile, loading, error } = useProfile();

  if (loading) return <div>Loading your profile…</div>;
  if (error) return <div className='text-red-500'>Error: {error}</div>;
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
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>
        Welcome back,{' '}
        <span className='text-purple-400'>{profile.username}</span>!
      </h1>

      <HybridRecs userProfile={userProfileForReco} />

      <h2 className='text-xl font-bold mt-8'>Your Learning Progress</h2>
      <ProgressChart />
    </div>
  );
}
