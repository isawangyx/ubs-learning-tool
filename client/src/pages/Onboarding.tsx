import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { HiSparkles } from 'react-icons/hi';
import { ProfileForm, ProfilePayload } from '@/components/ProfileForm';

export function Onboarding() {
  const methods = useForm<ProfilePayload>({
    defaultValues: {
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
    },
  });
  const { access } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (data: ProfilePayload) => {
    try {
      await api.patch('/api/profile/me/', data, {
        headers: { Authorization: `Bearer ${access}` },
      });
      nav('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Onboarding submission failed:', err.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-2xl bg-white shadow-md rounded-lg p-8'>
        <div className='flex justify-center items-center space-x-2 mb-6'>
          <h2 className='text-2xl font-semibold'>Tell Us About You</h2>
          <HiSparkles className='text-indigo-600 text-xl' />
        </div>
        <ProfileForm methods={methods} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
