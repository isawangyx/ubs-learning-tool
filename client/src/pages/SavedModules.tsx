import React, { useState, useEffect } from 'react';
import { fetchSavedModules, SavedModule, unsaveModule } from '../api/bookmarks';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';

export function SavedModules() {
  const [saved, setSaved] = useState<SavedModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedModules()
      .then((data) => setSaved(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  console.log('Saved modules data:', saved);

  const handleUnsave = async (savedId: number) => {
    try {
      await unsaveModule(savedId);
      setSaved((prev) => prev.filter((s) => s.id !== savedId));
    } catch (e) {
      console.error('Failed to unsave module', e);
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return <div className='text-red-600 text-center py-10'>{error}</div>;
  if (!saved.length)
    return (
      <div className='text-center py-10'>
        You haven’t saved any modules yet.
      </div>
    );

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6 ml-2'>Saved Modules</h2>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {saved.map((s) => {
          const m = s.module;
          return (
            <Card key={s.id} className='relative hover:shadow-lg'>
              <button
                onClick={() => handleUnsave(s.id)}
                className='absolute top-2 right-2 p-1'
                aria-label='Remove bookmark'
              >
                <BookmarkSolid className='w-5 h-5 text-indigo-600' />
              </button>
              <CardContent className='space-y-2'>
                <h3 className='font-semibold truncate'>{m.title}</h3>
                <p className='text-sm text-gray-600'>
                  {m.duration} hrs • {m.level}
                </p>
                <Button size='sm' asChild>
                  <a href={`/module/${m.id}`}>View Module</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
