import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { CourseRepository } from '../data/repositories/CourseRepository';
import { CourseUseCases } from '../domain/usecases/CourseUseCases';
import ApiClient from '../data/ApiClient';
import { useDispatch } from 'react-redux';
import { setEnrolledCourses } from '../store/courseSlice';

interface Dependencies {
  courseRepository: CourseRepository;
  courseUseCases: CourseUseCases;
  apiClient: typeof ApiClient;
}

// create context for dependency
const DependencyContext = createContext<Dependencies | undefined>(undefined);

export const DependencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  // create single instances of all dependencies
  // this will remove all my individual repository instances
  const courseRepository = new CourseRepository();
  const courseUseCases = new CourseUseCases(courseRepository);

  // load enrollments on app start (moved this logic from App.tsx)
  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const enrolled = await courseUseCases.getEnrolledCourses();
        dispatch(setEnrolledCourses(enrolled));
      } catch (error) {
        console.error('Failed to load enrollments:', error);
      }
    };
    loadEnrollments();
  }, []);

  const dependencies: Dependencies = {
    courseRepository,
    courseUseCases,
    apiClient: ApiClient,
  };

  return <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>;
};

// custom hook to use dependencies
export const useDependencies = (): Dependencies => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within DependencyProvider');
  }
  return context;
};

// specific hooks for individual dependencies
export const useCourseUseCases = () => {
  const { courseUseCases } = useDependencies();
  return courseUseCases;
};

export const useCourseRepository = () => {
  const { courseRepository } = useDependencies();
  return courseRepository;
};
