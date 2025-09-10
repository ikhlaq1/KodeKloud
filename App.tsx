import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useEffect } from 'react';
import { CourseRepository } from './src/data/repositories/CourseRepository';
import { CourseUseCases } from './src/domain/usecases/CourseUseCases';
import { setEnrolledCourses } from './src/store/courseSlice';
const courseRepository = new CourseRepository();
const courseUseCases = new CourseUseCases(courseRepository);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  //on app start check fir enrolled courses from async storahge
  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const enrolled = await courseUseCases.getEnrolledCourses();
      store.dispatch(setEnrolledCourses(enrolled));
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    }
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
