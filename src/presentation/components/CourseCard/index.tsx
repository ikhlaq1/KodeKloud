import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Course } from '../../../domain/Course';
import { styles } from './styles';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => {
  const authorName = course.tutors?.[0]?.name || '';
  const categoryName = course.categories?.[0]?.name || '';
  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const isEnrolled = enrolledCourses.includes(course.slug);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnail} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.author}>by {authorName}</Text>
        {isEnrolled && (
          <View style={styles.enrolledBadge}>
            <Text style={styles.enrolledText}>✓ Enrolled</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{course.difficulty_level}</Text>
          </View>

          {categoryName ? (
            <Text style={styles.category} numberOfLines={1}>
              {categoryName}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
