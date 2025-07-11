import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCertifiedModules } from '../api/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

interface Module {
  id: number;
  title: string;
}
export interface Certified {
  id: number;
  module: Module;
  grade: number;
  last_event: string;
  ndays_act: number;
  nchapters: number;
  certified: boolean;
}

export function Certifications() {
  const [certs, setCerts] = useState<Certified[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifiedModules()
      .then((data) => setCerts(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  console.log('Certifications data:', certs);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div className='text-red-600 text-center py-10'>Error: {error}</div>;
  }
  if (!certs.length) {
    return (
      <div className='text-center py-10'>
        You don't have any certifications yet.
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6 ml-2'>Your Certifications</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {certs.map((cert) => (
          <Card key={cert.id} className='hover:shadow-lg transition'>
            <CardContent className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <CheckBadgeIcon className='w-6 h-6 text-green-500' />
                <h3 className='text-lg font-semibold truncate'>
                  {cert.module.title}
                </h3>
              </div>

              <div className='flex items-center space-x-2 text-sm text-gray-700'>
                <span>Score:</span>
                <Badge variant='secondary'>{cert.grade}%</Badge>
              </div>

              <div className='text-sm text-gray-500'>
                Certified on: {format(new Date(cert.last_event), 'PPP')}
              </div>

              <Link to={`/module/${cert.module.id}`}>
                <Button size='sm' className='w-full'>
                  View Module
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
