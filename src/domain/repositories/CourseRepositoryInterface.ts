import { CourseListResponse } from '../Course';

export interface CourseRepositoryInterface {
  getCourses(page: number): Promise<CourseListResponse>;
  getCourseDetails(slug: string): Promise<any>;
}
