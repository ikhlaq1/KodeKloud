import { CourseListResponse } from '../Course';

export interface CourseRepositoryInterface {
  getCourses(page: number): Promise<CourseListResponse>;
  getCourseDetails(slug: string): Promise<any>;
  getEnrolledCourses(): Promise<string[]>;
  saveEnrolledCourse(slug: string): Promise<void>;
}
