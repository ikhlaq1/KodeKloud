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
  };
}
