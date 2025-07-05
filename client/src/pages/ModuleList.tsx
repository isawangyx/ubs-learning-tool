import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Module, fetchModules, PaginatedModules } from '../api/modules';

export function ModuleList() {
  const [data, setData] = useState<PaginatedModules | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchModules(page, 12)
      .then((json) => {
        if (json.count > 100) json.count = 100;
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div>Loading modules…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  const totalPages = Math.ceil(data.count / 12);
  console.log('ModuleList data:', data);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Modules</h1>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {data.results.map((m: Module) => {
          const skills =
            typeof m.skill_tags === 'string'
              ? JSON.parse(m.skill_tags)
              : m.skill_tags;

          return (
            <li key={m.id} className='p-4 border rounded hover:shadow'>
              <Link to={`/module/${m.id}`}>
                <h2 className='font-semibold'>{m.title}</h2>
                <p className='text-sm text-gray-600'>
                  {m.duration} hrs — {m.level}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  Skill Tags: {skills.join(', ')}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  ⭐ Rating: {m.avg_rating} ({m.review_count} reviews)
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className='px-3 py-1 bg-gray-200 rounded disabled:opacity-50'
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className='px-3 py-1 bg-gray-200 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
}
