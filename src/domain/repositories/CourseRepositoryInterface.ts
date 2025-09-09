import { CourseListResponse } from '../Course';

export interface CourseRepositoryInterface {
  getCourses(page: number): Promise<CourseListResponse>;
}
