import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Course } from '../../../domain/Course';
import { styles } from './styles';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import {
  calculateCourseProgress,
  getCourseProgress,
  getSecureImageUrl,
  saveCourseProgress,
} from '../../../utils/helperFunctions';
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
  const savedProgress = getCourseProgress(course.slug);
  //using courseDetails here, it will be available for only going courses and doesnt break if details are not available
  const courseDetails = useSelector((state: RootState) => state.courses.courseDetails[course.slug]);

  const progress = useMemo(() => {
    if (isEnrolled && courseDetails?.modules) {
      const calculatedProgress = calculateCourseProgress(course.slug, courseDetails.modules);
      if (calculatedProgress !== savedProgress) {
        saveCourseProgress(course.slug, calculatedProgress);
      }
      return calculatedProgress;
    }
    return isEnrolled ? savedProgress : 0;
  }, [isEnrolled, courseDetails?.modules, course.slug, savedProgress]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        onError={err => {
          console.log('Error loading thumbnail', err);
        }}
        source={{ uri: getSecureImageUrl(course.thumbnail_url) }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      {isEnrolled && (
        <View style={styles.enrolledBadge}>
          <Text style={styles.enrolledText}>✓ Enrolled</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.author}>by {authorName}</Text>

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
