import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModuleById } from '../api/modules';
import { updateProgress, ProgressResponse } from '../api/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Clock, Star, BookOpen, CheckCircle, CalendarDays } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';

export type ModuleType = 'quiz' | 'code' | 'proj';

export interface ModuleProps {
  id: number;
  title: string;
  duration: number;
  skill_tags: string[];
  goal_tags: string[];
  level: string;
  avg_rating: number;
  review_count: number;
}

export function ModuleDetails() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<ModuleProps | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [grade, setGrade] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!moduleId) return;
        setLoading(true);
        const data = await fetchModuleById(Number(moduleId));
        setModule({
          ...data,
          skill_tags:
            typeof data.skill_tags === 'string'
              ? JSON.parse(data.skill_tags)
              : data.skill_tags,
          goal_tags:
            typeof data.goal_tags === 'string'
              ? JSON.parse(data.goal_tags)
              : data.goal_tags,
          id: data.id,
        });
        const prog = await updateProgress({
          module_id: Number(moduleId),
          event_type: 'view',
        });
        setProgress(prog);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [moduleId]);

  console.log('ModuleDetails', { module, progress });

  const handleChapterComplete = async () => {
    if (!module) return;
    try {
      const prog = await updateProgress({
        module_id: module.id,
        event_type: 'chapter',
      });
      setProgress(prog);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async () => {
    if (grade === '') {
      setError('Enter your grade before completing.');
      return;
    }
    try {
      const prog = await updateProgress({
        module_id: Number(moduleId),
        event_type: 'complete',
        grade: Number(grade),
        certified: true,
      });
      setProgress(prog);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return <p className='text-red-600 text-center mt-10'>Error: {error}</p>;
  if (!module || !progress)
    return <p className='text-center mt-10'>Module not found.</p>;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-3xl font-bold flex-1'>{module.title}</h1>
        <Badge className='self-start'>{module.level}</Badge>
      </div>
      {/* Completion Status */}
      {progress.certified && (
        <div className='flex items-center space-x-2 text-green-600'>
          <CheckCircle className='w-5 h-5' />
          <span className='font-medium'>You have earned your certificate!</span>
        </div>
      )}

      {/* Progress Summary */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow'>
        <div className='flex items-center space-x-2'>
          <BookOpen className='w-5 h-5 text-indigo-500' />
          <span>{progress.nchapters} chapters completed</span>
        </div>
        <div className='flex items-center space-x-2'>
          <CalendarDays className='w-5 h-5 text-green-500' />
          <span>{progress.ndays_act} days active</span>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='w-5 h-5 text-gray-600' />
          <span>
            Last activity:{' '}
            {differenceInCalendarDays(
              Date.now(),
              new Date(progress.last_event)
            )}{' '}
            days ago
          </span>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-6'>
        <div className='flex items-center space-x-1 text-gray-700'>
          <Star className='w-5 h-5 text-yellow-500' />
          <span>
            {module.avg_rating.toFixed(1)} ({module.review_count})
          </span>
        </div>
        <div className='flex items-center space-x-1 text-gray-700'>
          <Clock className='w-5 h-5' />
          <span>{module.duration} hrs</span>
        </div>

        {!progress.certified && (
          <div className='flex items-center justify-between'>
            <Button onClick={handleChapterComplete} variant='default'>
              Complete Chapter {progress.nchapters + 1}
            </Button>
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <div>
          <h2 className='font-semibold mb-2'>Skills Covered</h2>
          <div className='flex flex-wrap gap-2'>
            {module.skill_tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Card>
          <CardContent>
            <h2 className='font-semibold pb-2'>Learning Goals</h2>
            <ul className='list-disc list-inside text-gray-700'>
              {module.goal_tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {!progress.certified && (
        <>
          <div className='bg-white p-6 rounded shadow flex'>
            <div className='flex items-center gap-2 flex-1'>
              <label className='whitespace-nowrap'>Grade:</label>
              <input
                type='number'
                min={0}
                max={100}
                value={grade}
                onChange={(e) =>
                  setGrade(e.target.value === '' ? '' : Number(e.target.value))
                }
                className='w-25 p-1 border rounded'
              />
            </div>
            <Button onClick={handleComplete} variant='default'>
              Complete Module
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
