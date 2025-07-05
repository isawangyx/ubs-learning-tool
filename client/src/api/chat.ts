import { api } from '../lib/api';

export interface Source {
  rating: number;
  title: string;
  skills: string[];
  duration: number;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export function fetchChatResponse(question: string): Promise<ChatResponse> {
  return api
    .post<ChatResponse>('/api/rag/chat/', { question })
    .then((res) => res.data);
}
