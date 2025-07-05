import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { fetchChatResponse, ChatResponse, Source } from '../api/chat';
import { useProfile } from '../hooks/useProfile';

export function ChatPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const { profile } = useProfile();
  const username = profile?.username || 'User';

  const suggestions = [
    'Write a to-do list for a personal project',
    'Generate an email to reply to a job offer',
    'Summarize this article in one paragraph',
    'How does AI work in a technical capacity',
  ];

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const data: ChatResponse = await fetchChatResponse(question);
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (e) {
      console.error(e);
      setAnswer('Error fetching answer.');
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <div className='mx-auto w-12 h-12 bg-purple-200 rounded-full mb-4'></div>
        <h1 className='text-2xl font-semibold'>{`Good Afternoon, ${username}`}</h1>
        <p className='text-lg text-gray-600'>
          What&rsquo;s on <span className='text-purple-400'>your mind?</span>
        </p>
      </div>

      <div className='bg-white shadow-md rounded-lg p-4 mb-6'>
        <textarea
          rows={3}
          className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-purple-300'
          placeholder='Ask AI a question or make a request...'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className='flex items-center justify-between mt-2'>
          <button className='px-3 py-1 bg-gray-100 rounded-md'>
            📎 Attach
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='px-4 py-2 bg-black text-white rounded-md disabled:opacity-50'
          >
            {loading ? '...' : '↑'}
          </button>
        </div>
      </div>

      {!answer && (
        <div className='grid grid-cols-2 gap-4 mb-6'>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setQuestion(s)}
              className='p-4 bg-white rounded-lg shadow-sm hover:shadow-md text-left'
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {answer && (
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <div className='prose whitespace-pre-wrap'>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
          {sources.length > 0 && (
            <div className='mt-4'>
              <h3 className='font-semibold'>Sources:</h3>
              <ul className='list-disc pl-5'>
                {sources.map((src, i) => (
                  <li key={i} className='text-sm'>
                    {src.title} (rating: {src.rating})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
