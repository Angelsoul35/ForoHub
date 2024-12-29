import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import type { Topic as TopicType, Response, User } from '@/types';

export function Topic() {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const [topic, setTopic] = useState<TopicType | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [users, setUsers] = useState<Record<string, User>>({});

  useEffect(() => {
    if (topicId) {
      fetchTopic();
      fetchResponses();
    }
  }, [topicId]);

  async function fetchTopic() {
    if (!topicId) return;
    const { data } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();
    
    if (data) {
      setTopic(data);
      fetchUser(data.created_by);
    }
  }

  async function fetchResponses() {
    if (!topicId) return;
    const { data } = await supabase
      .from('responses')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true });
    
    if (data) {
      setResponses(data);
      data.forEach(response => fetchUser(response.created_by));
    }
  }

  async function fetchUser(userId: string) {
    if (users[userId]) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setUsers(prev => ({ ...prev, [userId]: data }));
    }
  }

  async function handleCreateResponse(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !topicId) return;

    const { error } = await supabase.from('responses').insert({
      content: newResponse,
      topic_id: topicId,
      created_by: user.id,
    });

    if (!error) {
      setNewResponse('');
      fetchResponses();
    }
  }

  if (!topic) return null;

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
        <div className="text-sm text-gray-500 mt-2">
          Posted by {users[topic.created_by]?.username || 'Unknown'} on{' '}
          {format(new Date(topic.created_at), 'PPP')}
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{topic.content}</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Responses</h2>
        
        {user && (
          <form onSubmit={handleCreateResponse} className="bg-white p-6 rounded-lg shadow-sm">
            <label htmlFor="response" className="block text-sm font-medium text-gray-700">
              Your Response
            </label>
            <textarea
              id="response"
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
            <div className="mt-4">
              <Button type="submit">Post Response</Button>
            </div>
          </form>
        )}

        {responses.map((response) => (
          <div key={response.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-2">
              {users[response.created_by]?.username || 'Unknown'} responded on{' '}
              {format(new Date(response.created_at), 'PPP')}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{response.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}