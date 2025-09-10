import React, { useRef, useState } from 'react';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VideoPlayerRouteProp } from '../../../navigation/types';
import { MMKV } from 'react-native-mmkv';
import styles from './styles';
import {
  formatTime,
  getCurrentPercentage,
  saveCourseProgress,
} from '../../../utils/helperFunctions';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { updateLessonCompletion } from '../../../store/courseSlice';

const storage = new MMKV();
const VideoPlayerScreen = () => {
  const route = useRoute<VideoPlayerRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { lessonId, videoUrl, courseSlug } = route.params;
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<VideoRef>(null);
  //keys to track progress and completion of video
  const progressKey = `video_progress_${courseSlug}_${lessonId}`;
  const completedInPercentageKey = `lesson_completed_${courseSlug}_${lessonId}`;
  const lastSaveTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const onProgress = (data: any) => {
    const currentTime = data.currentTime;
    currentTimeRef.current = currentTime;
    //todo optimise this saving time not per event but after 5 seconds
    const timeSinceLastSave = currentTime - lastSaveTimeRef.current;
    if (timeSinceLastSave >= 5) {
      saveProgress(currentTime);
      lastSaveTimeRef.current = currentTime;
    }
  };

  //todo later implement back button at top left
  const handleBack = () => {
    if (currentTimeRef.current > 0) {
      saveProgress(currentTimeRef.current);
    }
    navigation.goBack();
    return true;
  };

  const saveProgress = (elapsedTime: number) => {
    storage.set(progressKey, elapsedTime);
    const currentPercentage = getCurrentPercentage(elapsedTime, duration);
    console.log('🚀 ~ saveProgressss ~ currentPercentage:', currentPercentage);
    storage.set(completedInPercentageKey, currentPercentage);
    // added status in redux to avoid force or focus re renders on other screens
    dispatch(
      updateLessonCompletion({
        courseSlug,
        lessonId,
        percentage: currentPercentage,
      }),
    );
    saveCourseProgress(courseSlug, currentPercentage);
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    // Seek to saved position
    const savedPosition = storage.getNumber(progressKey);
    if (savedPosition && savedPosition > 0 && videoRef.current) {
      videoRef.current.seek(savedPosition);
      Alert.alert('Resuming', `Resuming from ${formatTime(savedPosition)} seconds`);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: videoUrl,
        }}
        style={styles.video}
        onLoad={onLoad}
        onProgress={onProgress}
        onError={error => {
          console.error('Video error:', error);
          Alert.alert('Error', 'Failed to load video');
        }}
        resizeMode="contain"
        controls
      />
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}> Back </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VideoPlayerScreen;
