import React, { useRef } from 'react';
import { View, Alert } from 'react-native';
import Video from 'react-native-video';
import { useRoute, useNavigation } from '@react-navigation/native';
import { VideoPlayerRouteProp } from '../../../navigation/types';
import styles from './styles';

const VideoPlayerScreen = () => {
  const route = useRoute<VideoPlayerRouteProp>();
  const navigation = useNavigation();
  const { lessonId, videoUrl, courseSlug } = route.params;
  console.log('🚀 ~ VideoPlayerScreen ~ videoUrl:', videoUrl);

  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: videoUrl,
        }}
        style={styles.video}
        onError={error => {
          console.error('Video error:', error);
          Alert.alert('Error', 'Failed to load video');
        }}
        resizeMode="contain"
        controls
      />
    </View>
  );
};

export default VideoPlayerScreen;
