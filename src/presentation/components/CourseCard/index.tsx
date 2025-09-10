import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Course } from '../../../domain/Course';
import { styles } from './styles';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { calculateCourseProgress } from '../../../utils/helperFunctions';
import Progress from '../ProgressBar';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => {
  const authorName = course.tutors?.[0]?.name || '';
  const categoryName = course.categories?.[0]?.name || '';
  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const isEnrolled = enrolledCourses.includes(course.slug);

  //using courseDetails here, it will be available for only going courses and doesnt break if details are not available
  const courseDetails = useSelector((state: RootState) => state.courses.courseDetails[course.slug]);

  const progress =
    isEnrolled && courseDetails?.modules
      ? calculateCourseProgress(course.slug, courseDetails.modules)
      : 0;

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
        {isEnrolled && progress > 0 && <Progress progress={progress} />}

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
