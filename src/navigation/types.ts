import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
export type RootStackParamList = {
  CourseList: undefined;
  CourseDetail: { courseId: string; courseSlug: string; courseTitle: string };
};

export type NavigationProp = StackNavigationProp<RootStackParamList, 'CourseList'>;
export type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
