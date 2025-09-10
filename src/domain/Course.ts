//types for course list starts here
export interface Course {
  id: string;
  title: string;
  thumbnail_url: string;
  difficulty_level: string;
  slug: string;
  plan: string;
  tutors: Array<{
    name: string;
  }>;
  categories: Array<{
    name: string;
  }>;
}

export interface CourseListResponse {
  courses: Course[];
  metadata: {
    page: number;
    total_count: number;
    limit: number;
    next_page: number | null;
  };
}

//types for course detailstarts here
export interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  duration?: number;
  video_url?: string;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail_url: string;
  difficulty_level: string;
  course_duration: number;
  plan: string;
  tutors: Array<{
    name: string;
  }>;
  categories: Array<{
    name: string;
  }>;
  modules: Module[];
}

export interface CourseDetailResponse {
  course: CourseDetail;
}
