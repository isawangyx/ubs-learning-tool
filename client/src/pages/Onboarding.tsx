import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface ProfilePayload {
  career_stage: string;
  skills: string[];
  goals: string[];
  weekly_availability: Record<string, number>;
  preferred_content: string[];
}

export function Onboarding() {
  const methods = useForm<ProfilePayload>({
    defaultValues: {
      career_stage: '',
      skills: [],
      goals: [],
      weekly_availability: {},
      preferred_content: [],
    },
  });
  const { access } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: ProfilePayload) => {
    await axios.post('/api/profile/', data, {
      headers: { Authorization: `Bearer ${access}` },
    });
    navigate('/dashboard');
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto mt-10 space-y-8"
      >
        {/* Step 1: Career stage */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Career Stage</h3>
          <select
            className="w-full border rounded px-3 py-2"
            {...methods.register('career_stage', { required: true })}
          >
            <option value="">Select...</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </section>

        {/* Step 2: Skills */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          {['Frontend', 'Backend', 'Data Science', 'DevOps'].map((skill) => (
            <label key={skill} className="block">
              <input
                type="checkbox"
                value={skill}
                {...methods.register('skills')}
                className="mr-2"
              />
              {skill}
            </label>
          ))}
        </section>

        {/* Step 3: Goals */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Goals</h3>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="E.g. Become a full‑stack dev"
            {...methods.register('goals')}
          ></textarea>
        </section>

        {/* Step 4: Weekly Availability */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Weekly Availability (hours)</h3>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="flex items-center mb-2">
              <label className="w-16">{d}</label>
              <input
                type="number"
                min="0"
                className="border rounded px-3 py-1 w-20"
                {...methods.register(`weekly_availability.${d}` as const, {
                  valueAsNumber: true,
                })}
              />
            </div>
          ))}
        </section>

        {/* Step 5: Preferred Content */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Preferred Learning Format</h3>
          {['Projects', 'Quizzes', 'Videos', 'Articles'].map((fmt) => (
            <label key={fmt} className="block">
              <input
                type="checkbox"
                value={fmt}
                {...methods.register('preferred_content')}
                className="mr-2"
              />
              {fmt}
            </label>
          ))}
        </section>

        <button className="bg-purple-600 text-white px-6 py-2 rounded">
          Submit Profile
        </button>
      </form>
    </FormProvider>
  );
}
