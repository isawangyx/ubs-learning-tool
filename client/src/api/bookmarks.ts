import { api } from '../lib/api';
import { ModuleProps } from '../components/Module';

export interface SavedModule {
  id: number;
  module: ModuleProps;
  saved_at: string;
}

export function fetchSavedModules(): Promise<SavedModule[]> {
  return api.get<SavedModule[]>('/api/saved-modules/').then((res) => res.data);
}

export function saveModule(moduleId: number): Promise<SavedModule> {
  return api
    .post<SavedModule>('/api/saved-modules/', { module_id: moduleId })
    .then((res) => res.data);
}

export function unsaveModule(savedId: number): Promise<void> {
  return api.delete(`/api/saved-modules/${savedId}/`);
}
