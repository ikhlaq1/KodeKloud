import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import CourseCard from '../../components/CourseCard';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../navigation/types';
import { useCourseList } from '../../hooks/useCourseList';

const CourseListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { courses, loading, loadingMore, error, loadMore } = useCourseList();

  const handleCoursePress = (course: any) => {
    navigation.navigate('CourseDetail', {
      courseId: course.id,
      courseSlug: course.slug,
      courseTitle: course.title,
    });
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
