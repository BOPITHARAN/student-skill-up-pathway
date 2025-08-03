import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'student',
          paid: false
        }
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateUser: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Courses
  getCourses: async (category?: string) => {
    let query = supabase.from('courses').select(`
      *,
      topics:course_topics(
        *,
        media:course_media(*)
      )
    `);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  getCourse: async (id: string) => {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        topics:course_topics(
          *,
          media:course_media(*)
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  createCourse: async (course: any) => {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    return { data, error };
  },

  // Enrollments
  enrollInCourse: async (userId: string, courseId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress: 0
      })
      .select()
      .single();
    return { data, error };
  },

  getUserEnrollments: async (userId: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId);
    return { data, error };
  },

  // Payments
  recordPayment: async (userId: string, amount: number) => {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        amount,
        status: 'completed'
      })
      .select()
      .single();
    return { data, error };
  },

  // Feedback
  submitFeedback: async (userId: string, courseId: string, rating: number, comment: string) => {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        course_id: courseId,
        rating,
        comment
      })
      .select()
      .single();
    return { data, error };
  },

  getCourseFeedback: async (courseId: string) => {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        *,
        user:users(name, avatar)
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};