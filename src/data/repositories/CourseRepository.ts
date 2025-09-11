import { CourseRepositoryInterface } from '../../domain/repositories/CourseRepositoryInterface';
import { CourseListResponse } from '../../domain/Course';
import ApiClient from '../ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StorageService from '../../services/StorageService';

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
      return await StorageService.getEnrolledCourses();
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      return [];
    }
  }

  async saveEnrolledCourse(slug: string): Promise<void> {
    try {
      await StorageService.addEnrolledCourse(slug);
    } catch (error) {
      console.error('Error saving enrollment:', error);
      throw error;
    }
  }
}
