import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';
class StorageService {
  private storage: MMKV;
  private ENROLLMENT_KEY = '@enrolled_courses';
  constructor() {
    this.storage = new MMKV();
  }

  // course progress methods
  saveCourseProgress(courseSlug: string, progress: number): void {
    const key = `course_progress_${courseSlug}`;
    this.storage.set(key, progress);
  }

  getCourseProgress(courseSlug: string): number {
    const key = `course_progress_${courseSlug}`;
    return this.storage.getNumber(key) || 0;
  }

  // lesson completion methods
  saveLessonCompletion(courseSlug: string, lessonId: string, percentage: number): void {
    const key = `lesson_completed_${courseSlug}_${lessonId}`;
    this.storage.set(key, percentage);
  }

  getLessonCompletion(courseSlug: string, lessonId: string): number {
    const key = `lesson_completed_${courseSlug}_${lessonId}`;
    return this.storage.getNumber(key) || 0;
  }

  isLessonCompleted(courseSlug: string, lessonId: string): boolean {
    const key = `lesson_completed_${courseSlug}_${lessonId}`;
    return this.storage.getBoolean(key) || false;
  }

  // video progress methods
  saveVideoProgress(courseSlug: string, lessonId: string, progress: number): void {
    const key = `video_progress_${courseSlug}_${lessonId}`;
    this.storage.set(key, progress);
  }

  getVideoProgress(courseSlug: string, lessonId: string): number {
    const key = `video_progress_${courseSlug}_${lessonId}`;
    return this.storage.getNumber(key) || 0;
  }

  // enrolled course metjods
  async getEnrolledCourses(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(this.ENROLLMENT_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      return [];
    }
  }

  async saveEnrolledCourses(courses: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ENROLLMENT_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving enrolled courses:', error);
      throw error;
    }
  }

  async addEnrolledCourse(courseSlug: string): Promise<void> {
    try {
      const courses = await this.getEnrolledCourses();
      if (!courses.includes(courseSlug)) {
        courses.push(courseSlug);
        await this.saveEnrolledCourses(courses);
      }
    } catch (error) {
      console.error('Error adding enrolled course:', error);
      throw error;
    }
  }
}

export default new StorageService();
