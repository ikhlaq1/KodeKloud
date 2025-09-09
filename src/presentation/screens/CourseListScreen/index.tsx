// src/presentation/CourseListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import ApiClient from '../../../data/ApiClient';
import { Course } from '../../../domain/Course';
import { styles } from './styles';

const CourseListScreen = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses when screen loads
    ApiClient.getCourses(1)
      .then(response => {
        setCourses(response.courses);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.tutors[0]?.name}</Text>
        </View>
      )}
    />
  );
};

export default CourseListScreen;
