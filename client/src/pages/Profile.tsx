import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export function Profile() {
  const { access } = useAuth();
  const navigate = useNavigate();
  const { profile, loading, error } = useProfile();

  useEffect(() => {
    if (!access) {
      navigate('/login');
    }
  }, [access, navigate]);

  if (!access) {
    return null;
  }

  if (loading) {
    return <p className='text-center mt-10'>Loading profile...</p>;
  }

  if (error) {
    return (
      <div className='text-center mt-10 text-red-600'>
        Failed to load profile: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='text-center mt-10'>
        No profile found. Please create one.
      </div>
    );
  }

  const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className='max-w-3xl mx-auto px-6 py-12'>
      <h1 className='text-3xl font-semibold mb-6'>My Profile</h1>
      <div className='space-y-6 bg-white shadow rounded-lg p-6'>
        <div>
          <h2 className='text-lg font-medium'>Career Stage</h2>
          <p className='text-gray-700'>{profile.career_stage}</p>
        </div>

        <div>
          <h2 className='text-lg font-medium'>Skills</h2>
          <ul className='list-disc list-inside text-gray-700'>
            {profile.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-medium'>Career Goals</h2>
          <ul className='list-disc list-inside text-gray-700'>
            {profile.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-medium'>Weekly Availability</h2>
          <ul className='grid grid-cols-2 gap-2 text-gray-700'>
            {daysOrder.map((day) => {
              const hours = profile.weekly_availability?.[day] ?? 0;
              return (
                <li key={day}>
                  <strong>{day}:</strong> {hours} hr
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className='text-lg font-medium'>Preferred Content Types</h2>
          <ul className='list-disc list-inside text-gray-700'>
            {profile.preferred_content.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate('/edit-profile')}
          className='mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition'
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
