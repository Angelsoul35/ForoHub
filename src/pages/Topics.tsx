import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import type { Topic, Course } from '@/types';

export function Topics() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchTopics();
    }
  }, [courseId]);

  async function fetchCourse() {
    if (!courseId) return;
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (data) {
      setCourse(data);
    }
  }

  async function fetchTopics() {
    if (!courseId) return;
    const { data } = await supabase
      .from('topics')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setTopics(data);
    }
  }

  async function handleCreateTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !courseId) return;

    const { error } = await supabase.from('topics').insert({
      title: newTopic.title,
      content: newTopic.content,
      course_id: courseId,
      created_by: user.id,
    });

    if (!error) {
      setNewTopic({ title: '', content: '' });
      setIsCreating(false);
      fetchTopics();
    }
  }

  if (!course) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Topics</h2>
        {user && (
          <Button onClick={() => setIsCreating(true)}>Create Topic</Button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreateTopic} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4">New Topic</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newTopic.title}
                onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                value={newTopic.content}
                onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={5}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Topic
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {topics.map((topic) => (
          <div key={topic.id} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              <Link to={`/topics/${topic.id}`} className="hover:text-blue-600">
                {topic.title}
              </Link>
            </h3>
            <p className="text-gray-600 mt-2 line-clamp-3">{topic.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}