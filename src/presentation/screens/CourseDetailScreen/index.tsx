import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  setLoadingDetails,
  setCourseDetails,
  setError,
  enrollInCourse,
} from '../../../store/courseSlice';
import { RootStackParamList, NavigationProp } from '../../../navigation/types';
import { CourseRepository } from '../../../data/repositories/CourseRepository';
import { CourseUseCases } from '../../../domain/usecases/CourseUseCases';
import styles from './styles';
import {
  calculateCourseProgress,
  formatTime,
  getLessonCompletionPercentage,
  saveCourseProgress,
} from '../../../utils/helperFunctions';
import VideoIcon from '../../../assets/svg/videoIcon';
import ArticleIcon from '../../../assets/svg/articleIcon';
import LinkIcon from '../../../assets/svg/linkIcon';
import CompletedIcon from '../../../assets/svg/compeletedIcon';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;

const courseRepository = new CourseRepository();
const courseUseCases = new CourseUseCases(courseRepository);

const CourseDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CourseDetailRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { courseSlug } = route.params;
  const [courseProgress, setCourseProgress] = useState(0);

  // Get data from Redux
  const courseDetails = useSelector((state: RootState) => state.courses.courseDetails[courseSlug]);
  const loadingDetails = useSelector((state: RootState) => state.courses.loadingDetails);
  const lessonCompletions = useSelector((state: RootState) => state.courses.lessonCompletions);
  const enrolledCourses = useSelector((state: RootState) => state.courses.enrolledCourses);
  const isEnrolled = enrolledCourses.includes(courseSlug);

  const error = useSelector((state: RootState) => state.courses.error);

  //re fetching Data once user comes back from VideoPlayerScreen
  useFocusEffect(
    useCallback(() => {
      if (courseDetails?.modules) {
        const progress = calculateCourseProgress(courseSlug, courseDetails.modules);
        setCourseProgress(progress);
        //also save progress to mmkv, this will be used to show progress in course card
        saveCourseProgress(courseSlug, progress);
      }
    }, [courseDetails?.modules, courseSlug]),
  );

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
  const renderLessonItem = useCallback(
    ({ item: lesson }: { item: any }) => {
      const completionKey = `lesson_completed_${courseSlug}_${lesson.id}`;
      const completedInPercentage =
        lessonCompletions[completionKey] || getLessonCompletionPercentage(courseSlug, lesson.id);
      const completed = completedInPercentage > 90;

      return (
        <TouchableOpacity
          style={[styles.lessonCard, completed && styles.completedLesson]}
          onPress={() => handleLessonPress(lesson)}>
          <View style={styles.lessonIcon}>
            {completed ? <CompletedIcon height={20} width={20} /> : getLessonIcon(lesson.type)}
          </View>
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, completed && styles.completedText]}>
              {lesson.title}
            </Text>
            {completed && <Text style={styles.completedLabel}>Completed</Text>}
          </View>

          <View style={styles.lessonRight}>
            <Text style={[styles.lessonPercent, completed && styles.completedPercent]}>
              {Math.round(completedInPercentage)}%
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [courseSlug, lessonCompletions],
  );
  const renderSectionHeader = ({ section }: { section: any }) => (
    <Text style={styles.moduleTitle}>{section.title}</Text>
  );

  //function for enrolling in to a course
  const handleEnroll = async () => {
    if (isEnrolled) {
      Alert.alert('Already Enrolled', 'You are already enrolled in this course');
      return;
    }

    try {
      // Update Redux state
      dispatch(enrollInCourse(courseSlug));
      // Persist to AsyncStorage
      await courseUseCases.enrollInCourse(courseSlug);
      // Show confirmation
      Alert.alert('Enrolled!', `You have successfully enrolled in ${courseDetails?.title}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      Alert.alert('Error', 'Failed to enroll in course');
    }
  };

  // Get icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon height={20} width={20} />;
      case 'lab':
        return <ArticleIcon height={20} width={20} />;
      case 'article':
        return <LinkIcon height={20} width={20} />;
      default:
        return <ArticleIcon height={20} width={20} />;
    }
  };

  //added different vide url because vimeo video was expecting web frame
  const handleLessonPress = useCallback(
    (lesson: any) => {
      if (lesson.type === 'video') {
        navigation.navigate('VideoPlayer', {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          videoUrl:
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          courseSlug: courseSlug,
        });
      } else {
        Alert.alert('Coming Soon', `${lesson.type} lessons will be available soon`);
      }
    },
    [navigation, courseSlug],
  );

  const topSection = useMemo(() => {
    if (!courseDetails) return null;

    return (
      <View>
        <Image
          source={{ uri: courseDetails.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{courseDetails.title}</Text>

          <View style={styles.planBadge}>
            <Text style={styles.planText}>{courseDetails.plan.toUpperCase()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>
              {formatTime(courseDetails.includes_section.course_duration)}s
            </Text>
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

          {isEnrolled && courseProgress > 0 && (
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Course Progress: {courseProgress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${courseProgress}%` }]} />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.enrollButton, isEnrolled && styles.enrolledButton]}
            onPress={handleEnroll}
            disabled={isEnrolled}>
            <Text style={styles.enrollButtonText}>{isEnrolled ? '✓ Enrolled' : 'Enroll Now'}</Text>
          </TouchableOpacity>

          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>
              Course Content ({courseDetails.modules?.length || 0} modules)
            </Text>
          </View>
        </View>
      </View>
    );
  }, [courseDetails, isEnrolled, courseProgress, handleEnroll]);

  const keyExtractor = useCallback(
    (item: any, index: number) => item.id?.toString() || `lesson-${index}`,
    [],
  );

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
    <SectionList
      style={styles.container}
      sections={sectionsData}
      keyExtractor={keyExtractor}
      renderItem={renderLessonItem}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={topSection}
      initialNumToRender={10}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

export default CourseDetailScreen;
