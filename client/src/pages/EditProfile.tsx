import { useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { ProfileForm, ProfilePayload } from '../components/ProfileForm';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export function EditProfile() {
  const { access } = useAuth();
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();

  const defaultValues = useMemo<ProfilePayload>(() => {
    if (!profile) {
      return {
        career_stage: '',
        skills: [],
        goals: [],
        weekly_availability: {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        },
        preferred_content: [],
      };
    }
    return {
      career_stage: profile.career_stage,
      skills: profile.skills,
      goals: profile.goals,
      weekly_availability: Object.fromEntries(
        Object.entries(profile.weekly_availability).map(([day, value]) => [
          day,
          Number(value),
        ])
      ),
      preferred_content: profile.preferred_content,
    };
  }, [profile]);

  const methods = useForm<ProfilePayload>({
    defaultValues,
  });

  useEffect(() => {
    if (profile) {
      methods.reset(defaultValues);
    }
  }, [profile, defaultValues, methods]);

  if (!access) {
    return <div>Please log in before editing your profile.</div>;
  }

  if (loading) {
    return <div>Loading profile…</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  const handleSubmit = async (data: ProfilePayload) => {
    console.log('profile object:', profile);
    console.log('profile.id:', profile.id);
    try {
      await api.patch(`/api/profile/${profile.id}/`, data);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-2xl bg-white shadow-md rounded-lg p-8'>
        <button
          onClick={() => navigate('/profile')}
          className='self-start mb-4 text-indigo-600 hover:text-indigo-800 font-medium'
        >
          ← Back to Profile
        </button>
        <ProfileForm
          methods={methods}
          onSubmit={handleSubmit}
          buttonText='Update Profile'
        />
      </div>
    </div>
  );
}
