import { CourseRepositoryInterface } from '../../domain/repositories/CourseRepositoryInterface';
import { CourseListResponse } from '../../domain/Course';
import ApiClient from '../ApiClient';

export class CourseRepository implements CourseRepositoryInterface {
  private apiClient = ApiClient;
  // this getCourses is responsinle for getting data from API
  // business logic is not handled here
  async getCourses(page: number): Promise<CourseListResponse> {
    return await this.apiClient.getCourses(page);
  }
}
