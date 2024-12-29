export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  course_id: string;
  created_by: string;
  created_at: string;
}

export interface Response {
  id: string;
  content: string;
  topic_id: string;
  created_by: string;
  created_at: string;
}