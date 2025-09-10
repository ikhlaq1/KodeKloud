import { CourseRepositoryInterface } from '../repositories/CourseRepositoryInterface';
import { Course, CourseListResponse } from '../Course';

//this file will handle all the business logic for courses part
export class CourseUseCases {
  constructor(private repository: CourseRepositoryInterface) {}

  // Get initial courses list
  //also these use cases will be used by our UI layer
  async getCourses(page: number = 1): Promise<CourseListResponse> {
    return await this.repository.getCourses(page);
  }

  // Load more courses
  async loadMoreCourses(
    currentPage: number,
    existingCourses: Course[],
  ): Promise<{
    allCourses: Course[];
    nextPage: number;
    hasMore: boolean;
  }> {
    const nextPage = currentPage + 1;
    const response = await this.repository.getCourses(nextPage);

    return {
      allCourses: [...existingCourses, ...response.courses],
      nextPage: nextPage,
      hasMore: response.metadata.next_page !== null,
    };
  }

  async getCourseDetails(slug: string): Promise<any> {
    return await this.repository.getCourseDetails(slug);
  }

  async getEnrolledCourses(): Promise<string[]> {
    return await this.repository.getEnrolledCourses();
  }

  async enrollInCourse(courseSlug: string): Promise<void> {
    await this.repository.saveEnrolledCourse(courseSlug);
  }

  async isEnrolled(courseSlug: string): Promise<boolean> {
    const enrollments = await this.repository.getEnrolledCourses();
    return enrollments.includes(courseSlug);
  }
}
