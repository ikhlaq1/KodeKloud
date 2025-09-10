import axios from 'axios';
import { CourseListResponse } from '../domain/Course';

class ApiClient {
  private baseURL = 'https://learn-api.kodekloud.com/api';

  async getCourses(page: number = 1): Promise<CourseListResponse> {
    const response = await axios.get(`${this.baseURL}/courses?page=${page}`);
    return response.data;
  }

  async getCourseDetails(slug: string): Promise<any> {
    const response = await axios.get(`${this.baseURL}/courses/${slug}`);
    return response.data;
  }
}

export default new ApiClient();
