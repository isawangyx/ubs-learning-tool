import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../lib/api';
import { HiOutlineArrowRight, HiSparkles } from 'react-icons/hi';

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
      weekly_availability: {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      },
      preferred_content: [],
    },
  });
  const { register, handleSubmit } = methods;
  const { access } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (data: ProfilePayload) => {
    await api.post('/api/profile/', data, {
      headers: { Authorization: `Bearer ${access}` },
    });
    nav('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <h2 className="text-2xl font-semibold">Tell Us About You</h2>
          <HiSparkles className="text-indigo-600 text-xl" />
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Career Stage */}
            <div>
              <label className="block mb-2 font-medium">Career Stage</label>
              <select
                {...register('career_stage', { required: true })}
                className="border border-gray-300 w-full rounded-lg px-3 py-2 focus:ring-indigo-500"
              >
                <option value="">Select your stage</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
            {/* Skills */}
            <div>
              <label className="block mb-2 font-medium">Skills</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Frontend',
                  'Backend',
                  'Data Science',
                  'DevOps',
                  'UX/UI',
                  'AI/ML',
                ].map((skill) => (
                  <label
                    key={skill}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      value={skill}
                      {...register('skills')}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Goals */}
            <div>
              <label className="block mb-2 font-medium">Career Goals</label>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="E.g. Frontend, Backend, ML"
                onChange={(e) =>
                  methods.setValue(
                    'goals',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                  )
                }
              />
            </div>
            {/* Weekly Availability */}
            <div>
              <label className="block mb-2 font-medium">
                Weekly Availability (hours)
              </label>
              <div className="grid grid-cols-4 gap-4">
                {Object.keys(methods.getValues('weekly_availability')).map(
                  (day) => (
                    <div key={day} className="flex flex-col">
                      <span className="text-sm font-medium">{day}</span>
                      <input
                        type="number"
                        min={0}
                        {...register(`weekly_availability.${day}` as const, {
                          valueAsNumber: true,
                        })}
                        className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-indigo-500"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            {/* Preferred Content */}
            <div>
              <label className="block mb-2 font-medium">
                Preferred Content Types
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['Projects', 'Quizzes', 'Videos', 'Problem Sets'].map(
                  (type) => (
                    <label
                      key={type}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={type}
                        {...register('preferred_content')}
                      />
                      <span>{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg flex justify-center items-center space-x-2 hover:bg-indigo-700 transition"
            >
              <span>Submit Profile</span>
              <HiOutlineArrowRight className="h-5 w-5" />
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
