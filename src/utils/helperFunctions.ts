import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();

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
  const completionKey = `lesson_completed_${courseSlug}_${lessonId}`;
  return storage.getNumber(completionKey) || 0;
};

export const calculateCourseProgress = (courseSlug: string, modules: any[]): number => {
  if (!modules || modules.length === 0) return 0;

  let totalLessons = 0;
  let completedLessons = 0;

  modules.forEach(module => {
    if (module.lessons) {
      module.lessons.forEach((lesson: any) => {
        totalLessons++;
        const completionKey = `lesson_completed_${courseSlug}_${lesson.id}`;

        if (storage.getBoolean(completionKey)) {
          completedLessons++;
        }
      });
    }
  });

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

export const getLessonProgress = (courseSlug: string, lessonId: string): number => {
  const progressKey = `video_progress_${courseSlug}_${lessonId}`;
  return storage.getNumber(progressKey) || 0;
};

export const saveCourseProgress = (courseSlug: string, progress: number): void => {
  const progressKey = `course_progress_${courseSlug}`;
  storage.set(progressKey, progress);
};

// Get saved course progress from MMKV
export const getCourseProgress = (courseSlug: string): number => {
  const progressKey = `course_progress_${courseSlug}`;
  return storage.getNumber(progressKey) || 0;
};
