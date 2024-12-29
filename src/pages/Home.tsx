import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/types';

export function Home() {
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchLatestCourses() {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setLatestCourses(data);
      }
    }

    fetchLatestCourses();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to ForoHub</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Courses</h2>
        <div className="space-y-4">
          {latestCourses.map((course) => (
            <div key={course.id} className="border-b pb-4">
              <h3 className="text-xl font-medium text-gray-900">
                <Link to={`/courses/${course.id}/topics`} className="hover:text-blue-600">
                  {course.title}
                </Link>
              </h3>
              <p className="text-gray-600 mt-1">{course.description}</p>
            </div>
          ))}
        </div>
        <Link
          to="/courses"
          className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          View all courses →
        </Link>
      </div>
    </div>
  );
}