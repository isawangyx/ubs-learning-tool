import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSavedModules, saveModule, unsaveModule } from '../api/bookmarks';
import { Link } from 'react-router-dom';
import { Module, fetchModules, PaginatedModules } from '../api/modules';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Clock, BarChart2, Star } from 'lucide-react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

export function ModuleList() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [data, setData] = useState<PaginatedModules | null>(null);
  const [savedMap, setSavedMap] = useState<Record<number, number>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchModules(page, 12, search)
      .then((json) => {
        if (json.count > 100) json.count = 100;
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    fetchSavedModules().then((list) => {
      const map: Record<number, number> = {};
      list.forEach((s) => {
        map[s.module.id] = s.id;
      });
      setSavedMap(map);
    });
  }, [page, search]);

  const handleToggleSave = async (moduleId: number) => {
    if (savedMap[moduleId]) {
      await unsaveModule(savedMap[moduleId]);
      setSavedMap((prev) => {
        const c = { ...prev };
        delete c[moduleId];
        return c;
      });
    } else {
      const saved = await saveModule(moduleId);
      setSavedMap((prev) => ({ ...prev, [moduleId]: saved.id }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className='text-red-600 text-center py-10'>Error: {error}</div>;
  }
  if (!data) return null;

  const totalPages = Math.ceil(data.count / 12);
  console.log('ModuleList data:', data);

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6 ml-2'>All Modules</h2>
      {search && (
        <p className='mb-4 text-gray-600'>
          Showing results for <strong>"{search}"</strong>
        </p>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.results.map((m: Module) => {
          const isSaved = Boolean(savedMap[m.id]);
          const skills =
            typeof m.skill_tags === 'string'
              ? JSON.parse(m.skill_tags)
              : m.skill_tags;

          return (
            <Card key={m.id} className='hover:shadow-lg transition relative'>
              <button
                onClick={() => handleToggleSave(m.id)}
                className='absolute top-2 right-2 p-1'
              >
                {isSaved ? (
                  <BookmarkSolid className='w-5 h-5 text-indigo-600' />
                ) : (
                  <BookmarkOutline className='w-5 h-5 text-gray-400' />
                )}
              </button>
              <Link to={`/module/${m.id}`}>
                <CardHeader>
                  <h2 className='text-xl font-semibold'>{m.title}</h2>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex items-center space-x-2 text-sm'>
                    <Clock className='w-4 h-4' />
                    <span>{m.duration} hrs</span>
                    <BarChart2 className='w-4 h-4 ml-4' />
                    <span>{m.level}</span>
                  </div>

                  <div className='flex flex-wrap gap-1'>
                    {skills.map((tag: string, idx: unknown) => (
                      <Badge
                        key={`${tag.trim()}-${idx}`}
                        className='whitespace-normal break-words'
                      >
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>

                  <div className='flex items-center space-x-1 text-sm'>
                    <Star className='w-4 h-4 text-yellow-500' />
                    <span>
                      {m.avg_rating.toFixed(1)} ({m.review_count})
                    </span>
                  </div>

                  <Button size='sm' variant='outline' className='mt-2'>
                    View Details
                  </Button>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center space-x-4 mt-8'>
        <Button
          size='sm'
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </Button>

        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <Button
          size='sm'
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
