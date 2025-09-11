import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  appendCourses,
  setCourses,
  setCurrentPage,
  setError,
  setHasMore,
  setLoading,
  setLoadingMore,
} from '../../store/courseSlice';
import { useCourseUseCases } from '../../context/DependencyContext';

export const useCourseList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const courseUseCases = useCourseUseCases();

  // Get all state from Redux
  const { courses, currentPage, hasMore, loading, loadingMore, error } = useSelector(
    (state: RootState) => state.courses,
  );

  // Fetch initial courses
  const fetchCourses = async () => {
    try {
      dispatch(setLoading(true));
      const response = await courseUseCases.getCourses(1);

      dispatch(setCourses(response.courses));
      dispatch(setCurrentPage(1));
      dispatch(setHasMore(response.metadata.next_page !== null));
    } catch (err) {
      dispatch(setError('Failed to load courses'));
      console.error(err);
    }
  };

  // Load more courses for pagination
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    dispatch(setLoadingMore(true));
    try {
      const nextPage = currentPage + 1;
      const response = await courseUseCases.getCourses(nextPage);

      dispatch(appendCourses(response.courses));
      dispatch(setCurrentPage(nextPage));
      dispatch(setHasMore(response.metadata.next_page !== null));
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      dispatch(setLoadingMore(false));
    }
  };

  // Refresh courses
  const refreshCourses = () => {
    fetchCourses();
  };

  // Load courses on mount
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, []);

  return {
    // State
    courses,
    loading,
    loadingMore,
    error,
    hasMore,

    // Actions
    loadMore,
    refreshCourses,
  };
};
