import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ApiClient from '../../../data/ApiClient';
import { Course } from '../../../domain/Course';
import CourseCard from '../../components/CourseCard';
import { styles } from './styles';

const CourseListScreen = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getCourses(1);
      setCourses(response.courses);
      setCurrentPage(1);
      //checking for if more pages can be requested after API call
      setHasMore(response.metadata.next_page !== null);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await ApiClient.getCourses(nextPage);
      setCourses([...courses, ...response.courses]);
      setCurrentPage(nextPage);
      setHasMore(response.metadata.next_page !== null);
    } catch (err) {
      console.error('Failed to load more:', err);
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
        onEndReached={loadMore} // Auto load when reaching end
        onEndReachedThreshold={0.5} // Load when 50% from bottom
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
