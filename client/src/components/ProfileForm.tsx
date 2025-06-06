import { FormProvider, UseFormReturn } from 'react-hook-form';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import React from 'react';

export interface ProfilePayload {
  career_stage: string;
  skills: string[];
  goals: string[];
  weekly_availability: Record<string, number>;
  preferred_content: string[];
}

interface ProfileFormProps {
  methods: UseFormReturn<ProfilePayload>;
  onSubmit: (data: ProfilePayload) => void;
  buttonText?: string;
}

export function ProfileForm({
  methods,
  onSubmit,
  buttonText = 'Submit Profile',
}: ProfileFormProps) {
  const { register, handleSubmit, getValues, watch } = methods;
  const [goalsInput, setGoalsInput] = useState('');

  useEffect(() => {
    const existingGoals: string[] = getValues('goals') || [];
    if (Array.isArray(existingGoals) && existingGoals.length > 0) {
      setGoalsInput(existingGoals.join(', '));
    }
  }, [getValues]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (Array.isArray(value.goals)) {
        setGoalsInput(value.goals.join(', '));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const availability = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
    ...methods.getValues('weekly_availability'),
  };

  const internalSubmit = handleSubmit((data) => {
    const parsedGoals = goalsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      ...data,
      goals: parsedGoals,
    });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={internalSubmit} className='space-y-6'>
        {/* Career Stage */}
        <div>
          <label className='block mb-2 font-medium'>Career Stage</label>
          <select
            {...register('career_stage')}
            className='border w-full rounded-lg px-3 py-2'
          >
            <option value=''>Select your stage</option>
            <option value='Junior'>Junior</option>
            <option value='Mid'>Mid</option>
            <option value='Senior'>Senior</option>
            <option value='Lead'>Lead</option>
          </select>
        </div>

        {/* Skills */}
        <div>
          <label className='block mb-2 font-medium'>Skills</label>
          <div className='grid grid-cols-2 gap-4'>
            {[
              'Frontend',
              'Backend',
              'Data Science',
              'DevOps',
              'UX/UI',
              'AI/ML',
            ].map((skill) => (
              <label key={skill} className='inline-flex items-center space-x-2'>
                <input type='checkbox' value={skill} {...register('skills')} />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Career Goals */}
        <div>
          <label className='block mb-2 font-medium'>Career Goals</label>
          <input
            type='text'
            className='w-full border rounded px-3 py-2'
            value={goalsInput}
            placeholder='E.g. Frontend, Backend, ML'
            onChange={(e) => setGoalsInput(e.target.value)}
          />
        </div>

        {/* Availability */}
        <div>
          <label className='block mb-2 font-medium'>
            Weekly Availability (hours)
          </label>
          <div className='grid grid-cols-4 gap-4'>
            {Object.keys(availability).map((day) => (
              <div key={day} className='flex flex-col'>
                <span className='text-sm font-medium'>{day}</span>
                <input
                  type='number'
                  min={0}
                  {...register(`weekly_availability.${day}` as const, {
                    valueAsNumber: true,
                  })}
                  className='border rounded px-2 py-1'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Preference */}
        <div>
          <label className='block mb-2 font-medium'>
            Preferred Content Types
          </label>
          <div className='grid grid-cols-2 gap-4'>
            {['Projects', 'Quizzes', 'Videos', 'Problem Sets'].map((type) => (
              <label key={type} className='inline-flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value={type}
                  {...register('preferred_content')}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-indigo-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 hover:bg-indigo-700 transition'
        >
          <span>{buttonText}</span>
          <HiOutlineArrowRight className='h-5 w-5' />
        </button>
      </form>
    </FormProvider>
  );
}
