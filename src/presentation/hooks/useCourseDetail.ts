import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { AppDispatch, RootState } from '../../store/store';
import {
  setLoadingDetails,
  setCourseDetails,
  setError,
  enrollInCourse as enrollInCourseAction,
} from '../../store/courseSlice';
import { useCourseUseCases } from '../../context/DependencyContext';
import { calculateCourseProgress, saveCourseProgress } from '../../utils/helperFunctions';

export const useCourseDetail = (courseSlug: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const courseUseCases = useCourseUseCases();
  const [courseProgress, setCourseProgress] = useState(0);

  // Get data from Redux
  const courseDetails = useSelector((state: RootState) => state.courses.courseDetails[courseSlug]);
  const loadingDetails = useSelector((state: RootState) => state.courses.loadingDetails);
  const lessonCompletions = useSelector((state: RootState) => state.courses.lessonCompletions);
  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const error = useSelector((state: RootState) => state.courses.error);

  const isEnrolled = enrolledCourses.includes(courseSlug);

  // Fetch course details
  const fetchCourseDetails = async () => {
    try {
      dispatch(setLoadingDetails(true));
      const response = await courseUseCases.getCourseDetails(courseSlug);
      const details = response.course || response;

      dispatch(
        setCourseDetails({
          slug: courseSlug,
          details,
        }),
      );
    } catch (err) {
      dispatch(setError('Failed to load course details'));
      console.error('Error fetching course details:', err);
    }
  };

  // Handle enrollment
  const enrollInCourse = async () => {
    if (isEnrolled) {
      Alert.alert('Already Enrolled', 'You are already enrolled in this course');
      return;
    }

    try {
      // Update Redux state
      dispatch(enrollInCourseAction(courseSlug));
      // Persist to AsyncStorage
      await courseUseCases.enrollInCourse(courseSlug);
      // Show confirmation
      Alert.alert('Enrolled!', `You have successfully enrolled in ${courseDetails?.title}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      Alert.alert('Error', 'Failed to enroll in course');
    }
  };

  // Calculate and update progress
  const updateProgress = useCallback(() => {
    if (courseDetails?.modules) {
      const progress = calculateCourseProgress(courseSlug, courseDetails.modules);
      setCourseProgress(progress);
      saveCourseProgress(courseSlug, progress);
    }
  }, [courseDetails?.modules, courseSlug]);

  // Load details on mount if not cached
  useEffect(() => {
    if (!courseDetails) {
      fetchCourseDetails();
    }
  }, [courseSlug]);

  // Update progress when course details or completions change
  useEffect(() => {
    updateProgress();
  }, [courseDetails?.modules, lessonCompletions]);

  return {
    // State
    courseDetails,
    loadingDetails,
    error,
    isEnrolled,
    courseProgress,
    lessonCompletions,

    // Actions
    enrollInCourse,
    refreshDetails: fetchCourseDetails,
    updateProgress,
  };
};
