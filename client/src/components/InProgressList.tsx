import React, { useState } from 'react';
import { BookOpenIcon, FireIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { differenceInCalendarDays } from 'date-fns';
import { Certified } from '../api/progress';

export function InProgressList({ inProgress }: { inProgress: Certified[] }) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...inProgress].sort(
    (a, b) =>
      new Date(b.last_event).getTime() - new Date(a.last_event).getTime()
  );

  const visibleModules = showAll ? sorted : sorted.slice(0, 5);

  return (
    <section>
      <h2 className='text-xl font-semibold mb-4'>Continue Learning</h2>
      <ul className='bg-white rounded-lg shadow divide-y'>
        {visibleModules.length > 0 ? (
          visibleModules.map((ip) => (
            <li
              key={ip.module.id}
              className='flex items-center justify-between p-4'
            >
              <div>
                <p className='font-medium'>{ip.module.title}</p>
                <div className='flex flex-wrap text-sm gap-4 mt-1'>
                  <span className='flex items-center space-x-1 text-indigo-600'>
                    <BookOpenIcon className='w-4 h-4' />
                    <span>{ip.nchapters} chapters</span>
                  </span>
                  <span className='flex items-center space-x-1 text-green-600'>
                    <FireIcon className='w-4 h-4' />
                    <span>{ip.ndays_act} days active</span>
                  </span>
                  <span className='flex items-center space-x-1 text-gray-500'>
                    <ClockIcon className='w-4 h-4' />
                    <span>
                      {differenceInCalendarDays(
                        Date.now(),
                        new Date(ip.last_event)
                      )}{' '}
                      days ago
                    </span>
                  </span>
                </div>
              </div>

              <Button size='sm' asChild>
                <Link to={`/module/${ip.module.id}`}>Continue</Link>
              </Button>
            </li>
          ))
        ) : (
          <li className='p-4 text-center text-gray-500'>
            You have no modules in progress.
          </li>
        )}
      </ul>

      {inProgress.length > 5 && (
        <div className='text-center mt-4'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll
              ? 'Show Less'
              : `Show More (${inProgress.length - 5} more)`}
          </Button>
        </div>
      )}
    </section>
  );
}
