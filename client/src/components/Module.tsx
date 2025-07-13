import React, { useEffect, useState } from 'react';
import { updateProgress } from '../api/progress';

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
export function Module({
  id: moduleId,
  title,
  duration,
  skill_tags,
  goal_tags,
  level,
  avg_rating,
  review_count,
}: ModuleProps) {
  const [grade, setGrade] = useState<number | ''>('');
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // mark module as viewed
  useEffect(() => {
    updateProgress({ module_id: moduleId, event_type: 'view' }).catch(
      console.error
    );
  }, [moduleId]);

  // mark chapter as complete
  const handleChapterComplete = async () => {
    try {
      await updateProgress({ module_id: moduleId, event_type: 'chapter' });
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // mark module as complete
  const handleComplete = async () => {
    if (grade === '') {
      setError('Please enter your grade.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await updateProgress({
        module_id: moduleId,
        event_type: 'complete',
        grade: Number(grade),
        certified,
      });
      setDone(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to submit progress');
      } else {
        setError('Failed to submit progress');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className='p-4 bg-green-100 rounded'>
        🎉 You’ve completed “{title}”!
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='p-4 border rounded bg-gray-50'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-sm text-gray-600'>
          {duration} hrs • {level}
        </p>
        <p className='mt-2 text-sm'>
          <strong>Skills:</strong> {skill_tags.join(', ')}
        </p>
        <p className='mt-1 text-sm'>
          <strong>Goals:</strong> {goal_tags.join('; ')}
        </p>
        <p className='mt-2 text-xs text-gray-500'>
          ⭐ {avg_rating.toFixed(1)} ({review_count} reviews)
        </p>
      </div>

      <button
        onClick={handleChapterComplete}
        className='px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600'
      >
        I finished this chapter
      </button>

      <div className='p-4 border rounded'>
        <h3 className='font-semibold mb-2'>Mark this module complete</h3>

        <div className='mb-2'>
          <label className='block text-sm font-medium'>Your grade</label>
          <input
            type='number'
            min={0}
            max={100}
            value={grade}
            onChange={(e) =>
              setGrade(e.target.value === '' ? '' : Number(e.target.value))
            }
            className='mt-1 block w-24 p-1 border rounded'
          />
        </div>

        <div className='mb-4'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              checked={certified}
              onChange={(e) => setCertified(e.target.checked)}
              className='form-checkbox'
            />
            <span className='ml-2 text-sm'>I earned a certificate</span>
          </label>
        </div>

        {error && <p className='text-red-600 mb-2'>{error}</p>}

        <button
          onClick={handleComplete}
          disabled={submitting}
          className='px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50'
        >
          {submitting ? 'Submitting…' : 'Complete Module'}
        </button>
      </div>
    </div>
  );
}
