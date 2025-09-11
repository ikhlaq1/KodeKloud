import { Platform } from 'react-native';
import StorageService from '../services/StorageService';

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const getCurrentPercentage = (elapsedTime: number, duration: number): number => {
  if (!duration || duration <= 0) return 0;
  const percentage = (elapsedTime / duration) * 100;
  return Number(Math.max(percentage, 0).toFixed(2));
};

export const getLessonCompletionPercentage = (courseSlug: string, lessonId: string): number => {
  return StorageService.getLessonCompletion(courseSlug, lessonId);
};

export const calculateCourseProgress = (courseSlug: string, modules: any[]): number => {
  if (!modules || modules.length === 0) return 0;

  let totalLessons = 0;
  let completedLessons = 0;

  modules.forEach(module => {
    if (module.lessons) {
      module.lessons.forEach((lesson: any) => {
        totalLessons++;
        if (StorageService.isLessonCompleted(courseSlug, lesson.id)) {
          completedLessons++;
        }
      });
    }
  });

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

export const getLessonProgress = (courseSlug: string, lessonId: string): number => {
  return StorageService.getVideoProgress(courseSlug, lessonId);
};

export const saveCourseProgress = (courseSlug: string, progress: number): void => {
  StorageService.saveCourseProgress(courseSlug, progress);
};

export const getCourseProgress = (courseSlug: string): number => {
  return StorageService.getCourseProgress(courseSlug);
};

export const getSecureImageUrl = (url: string): string => {
  if (!url) return '';
  if (Platform.OS === 'ios' && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};
