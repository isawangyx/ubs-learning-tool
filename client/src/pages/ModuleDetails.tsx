import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModuleById } from '../api/modules';
import { Module, ModuleProps } from '../components/Module';

export function ModuleDetails() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<ModuleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    setLoading(true);
    fetchModuleById(Number(moduleId))
      .then((data) => {
        const skillTags =
          typeof data.skill_tags === 'string'
            ? JSON.parse(data.skill_tags)
            : data.skill_tags;

        const goalTags =
          typeof data.goal_tags === 'string'
            ? JSON.parse(data.goal_tags)
            : data.goal_tags;

        setModule({
          ...data,
          skill_tags: skillTags,
          goal_tags: goalTags,
          moduleId: data.id,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <div>Loading module…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!module) return <div>Module not found.</div>;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 space-y-6'>
      <Module {...module} />
    </div>
  );
}
