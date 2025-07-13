import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Panda, Star, CalendarDays, Video, BookOpen } from 'lucide-react';

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
    <div className='max-w-3xl mx-auto px-6 py-12 space-y-8'>
      <Card className='flex items-center space-x-6 p-6'>
        <div>
          <h2 className='text-2xl font-semibold'>{profile.username}</h2>
          <p className='text-gray-600 flex items-center space-x-2'>
            <Panda className='w-5 h-5' />
            <span>{profile.career_stage}</span>
          </p>
        </div>
      </Card>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader className='flex items-center space-x-2'>
            <Star className='w-5 h-5 text-yellow-500' />
            <h2 className='text-lg font-medium'>Skills</h2>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            {profile.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex items-center space-x-2'>
            <BookOpen className='w-5 h-5 text-indigo-500' />
            <h2 className='text-lg font-medium'>Career Goals</h2>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            {profile.goals.map((goal) => (
              <Badge key={goal} variant='outline'>
                {goal}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className='flex items-center space-x-2'>
          <CalendarDays className='w-5 h-5 text-green-500' />
          <h2 className='text-lg font-medium'>Weekly Availability</h2>
        </CardHeader>
        <CardContent className='grid grid-cols-7 gap-4'>
          {daysOrder.map((day) => {
            const hrs = profile.weekly_availability?.[day] ?? 0;
            const pct = Math.min((Number(hrs) / 8) * 100, 100);
            return (
              <div key={day} className='flex flex-col items-center'>
                <span className='text-sm font-medium'>{day}</span>
                <div className='w-full bg-gray-200 rounded-full h-2 mt-1'>
                  <div
                    className='bg-green-500 h-2 rounded-full'
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className='text-xs text-gray-500 mt-1'>{hrs} hr</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex items-center space-x-2'>
          <Video className='w-5 h-5 text-purple-500' />
          <h2 className='text-lg font-medium'>Preferred Content</h2>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'>
          {profile.preferred_content.map((type) => (
            <Badge key={type} variant='secondary'>
              {type}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className='text-center'>
        <Button onClick={() => navigate('/edit-profile')} className='px-8 py-3'>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
