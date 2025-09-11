import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList, NavigationProp } from '../../../navigation/types';

import styles from './styles';
import {
  formatTime,
  getLessonCompletionPercentage,
  getSecureImageUrl,
} from '../../../utils/helperFunctions';
import VideoIcon from '../../../assets/svg/videoIcon';
import ArticleIcon from '../../../assets/svg/articleIcon';
import LinkIcon from '../../../assets/svg/linkIcon';
import CompletedIcon from '../../../assets/svg/compeletedIcon';
import { useCourseDetail } from '../../hooks/useCourseDetail';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
const CourseDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CourseDetailRouteProp>();
  const { courseSlug } = route.params;
  const {
    courseDetails,
    loadingDetails,
    error,
    courseProgress,
    lessonCompletions,
    isEnrolled,
    enrollInCourse,
  } = useCourseDetail(courseSlug);

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
          source={{ uri: getSecureImageUrl(courseDetails.thumbnail_url) }}
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
            onPress={enrollInCourse}
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
  }, [courseDetails, isEnrolled, courseProgress, enrollInCourse]);

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
