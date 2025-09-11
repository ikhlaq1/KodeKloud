import { MMKV } from 'react-native-mmkv';

class StorageService {
  private storage: MMKV;

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
    const data = this.storage.getString('@enrolled_courses');
    return data ? JSON.parse(data) : [];
  }

  async saveEnrolledCourses(courses: string[]): Promise<void> {
    this.storage.set('@enrolled_courses', JSON.stringify(courses));
  }

  async addEnrolledCourse(courseSlug: string): Promise<void> {
    const courses = await this.getEnrolledCourses();
    if (!courses.includes(courseSlug)) {
      courses.push(courseSlug);
      await this.saveEnrolledCourses(courses);
    }
  }
}

export default new StorageService();
