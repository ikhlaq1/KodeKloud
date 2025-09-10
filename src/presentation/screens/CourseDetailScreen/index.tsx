import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  SectionList,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { setLoadingDetails, setCourseDetails, setError } from '../../../store/courseSlice';
import { RootStackParamList } from '../../../navigation/types';
import { CourseRepository } from '../../../data/repositories/CourseRepository';
import { CourseUseCases } from '../../../domain/usecases/CourseUseCases';
import styles from './styles';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

const courseRepository = new CourseRepository();
const courseUseCases = new CourseUseCases(courseRepository);

const CourseDetailScreen = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const { courseSlug } = route.params;

  const dispatch = useDispatch<AppDispatch>();

  // Get data from Redux
  const courseDetails = useSelector((state: RootState) => state.courses.courseDetails[courseSlug]);
  const loadingDetails = useSelector((state: RootState) => state.courses.loadingDetails);
  const error = useSelector((state: RootState) => state.courses.error);

  useEffect(() => {
    // Only fetch if we don't have the details cached
    if (!courseDetails) {
      fetchCourseDetails();
    }
  }, [courseSlug]);

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

  // Transformed data for sectionList rendering
  const sectionsData = useMemo(() => {
    return (
      courseDetails?.modules?.map((module: any, moduleIndex: number) => ({
        title: `Module ${moduleIndex + 1}: ${module.title}`,
        data: module.lessons || [],
        moduleIndex,
        moduleId: module.id,
      })) || []
    );
  }, [courseDetails?.modules]);

  //created separate render function for lesson
  const renderLessonItem = ({ item: lesson }: { item: any }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => Alert.alert('Coming Soon', 'Video player will be added next')}>
      <Text style={styles.lessonIcon}>{getLessonIcon(lesson.type)}</Text>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Text style={styles.lessonType}>{lesson.type}</Text>
          {lesson.duration && (
            <Text style={styles.lessonDuration}>• {Math.ceil(lesson.duration / 60)} min</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <Text style={styles.moduleTitle}>{section.title}</Text>
  );

  const handleEnroll = () => {
    Alert.alert('Success', `You have enrolled in ${courseDetails?.plan || 'this'} course!`);
  };

  // Convert seconds to hours and minutes
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '▶️';
      case 'quiz':
        return '📝';
      case 'reading':
        return '📖';
      case 'assignment':
        return '📋';
      default:
        return '📄';
    }
  };

  if (loadingDetails && !courseDetails) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading course details...</Text>
      </View>
    );
  }

  if (error || !courseDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Course not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: courseDetails.thumbnail_url }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{courseDetails.title}</Text>

        {/* Course Plan Badge */}
        <View style={styles.planBadge}>
          <Text style={styles.planText}>{courseDetails.plan.toUpperCase()}</Text>
        </View>

        {/* Course Info */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{formatDuration(courseDetails.course_duration)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Instructor:</Text>
          <Text style={styles.value}>{courseDetails.tutors?.[0]?.name || 'Tutor Name'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Difficulty:</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{courseDetails.difficulty_level}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>

        {/* Course Modules */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>
            Course Content ({courseDetails.modules?.length || 0} modules)
          </Text>
          <SectionList
            sections={sectionsData}
            keyExtractor={(item, index) => item.id?.toString() || `lesson-${index}`}
            renderItem={renderLessonItem}
            renderSectionHeader={renderSectionHeader}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CourseDetailScreen;
