import { CourseRepositoryInterface } from '../../domain/repositories/CourseRepositoryInterface';
import { CourseListResponse } from '../../domain/Course';
import ApiClient from '../ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class CourseRepository implements CourseRepositoryInterface {
  private ENROLLMENT_KEY = '@enrolled_courses';
  private apiClient = ApiClient;

  // this getCourses is responsinle for getting data from API
  // business logic is not handled here

  //api call for getting course list
  async getCourses(page: number): Promise<CourseListResponse> {
    return await this.apiClient.getCourses(page);
  }

  //api call for getting course detail
  async getCourseDetails(slug: string): Promise<any> {
    return await this.apiClient.getCourseDetails(slug);
  }

  async getEnrolledCourses(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(this.ENROLLMENT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      return [];
    }
  }

  async saveEnrolledCourse(slug: string): Promise<void> {
    try {
      const enrollments = await this.getEnrolledCourses();
      if (!enrollments.includes(slug)) {
        enrollments.push(slug);
        await AsyncStorage.setItem(this.ENROLLMENT_KEY, JSON.stringify(enrollments));
      }
    } catch (error) {
      console.error('Error saving enrollment:', error);
      throw error;
    }
  }
}
