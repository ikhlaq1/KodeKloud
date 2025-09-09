import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ApiClient from '../../../data/ApiClient';
import { Course } from '../../../domain/Course';
import CourseCard from '../../components/CourseCard';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  appendCourses,
  setCourses,
  setCurrentPage,
  setError,
  setHasMore,
  setLoading,
  setLoadingMore,
} from '../../../store/courseSlice';
import { CourseRepository } from '../../../data/repositories/CourseRepository';
import { CourseUseCases } from '../../../domain/usecases/CourseUseCases';

const courseRepository = new CourseRepository();
const courseUseCases = new CourseUseCases(courseRepository);

const CourseListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  //replaced all state variables with values in store
  const { courses, currentPage, hasMore, loading, loadingMore, error } = useSelector(
    (state: RootState) => state.courses,
  );

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await courseUseCases.loadMoreCourses(nextPage, courses);
      dispatch(appendCourses(response.allCourses.slice(courses.length)));
      dispatch(setCurrentPage(nextPage));
      dispatch(setHasMore(response.hasMore));
    } catch (err) {
      console.error('Failed to load more:', err);
      dispatch(setLoadingMore(false));
    }
    setLoadingMore(false);
  };

  const handleCoursePress = (course: Course) => {
    console.log('Course pressed:', course.slug);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => handleCoursePress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#0066CC" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default CourseListScreen;
