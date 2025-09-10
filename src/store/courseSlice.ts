import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, CourseDetail } from '../domain/Course';

interface CourseState {
  courses: Course[];
  courseDetails: { [slug: string]: CourseDetail };
  enrolledCourses: string[];
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadingDetails: boolean;
  error: string | null;
  lessonCompletions: { [key: string]: number };
}

const initialState: CourseState = {
  courses: [],
  courseDetails: {},
  enrolledCourses: [],
  currentPage: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  loadingDetails: false,
  error: null,
  lessonCompletions: {},
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    //course list starts here
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.loadingMore = action.payload;
    },

    setCourses: (state, action: PayloadAction<Course[]>) => {
      console.log('🚀 ~ action:', action);
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    appendCourses: (state, action: PayloadAction<Course[]>) => {
      console.log('🚀 ~ action:', action);
      state.courses = [...state.courses, ...action.payload];
      state.loadingMore = false;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.loadingMore = false;
    },

    //course detail starts here
    setCourseDetails: (state, action: PayloadAction<{ slug: string; details: CourseDetail }>) => {
      state.courseDetails[action.payload.slug] = action.payload.details;
      state.loadingDetails = false;
    },
    setLoadingDetails: (state, action: PayloadAction<boolean>) => {
      state.loadingDetails = action.payload;
    },

    //enrollment section starts here
    setEnrolledCourses: (state, action: PayloadAction<string[]>) => {
      state.enrolledCourses = action.payload;
    },
    enrollInCourse: (state, action: PayloadAction<string>) => {
      if (!state.enrolledCourses.includes(action.payload)) {
        state.enrolledCourses.push(action.payload);
      }
    },

    //lesson status starts here

    updateLessonCompletion: (
      state,
      action: PayloadAction<{ courseSlug: string; lessonId: string; percentage: number }>,
    ) => {
      const key = `lesson_completed_${action.payload.courseSlug}_${action.payload.lessonId}`;
      state.lessonCompletions[key] = action.payload.percentage;
    },

    loadLessonCompletions: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.lessonCompletions = { ...state.lessonCompletions, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setLoadingMore,
  setCourses,
  appendCourses,
  setCurrentPage,
  setCourseDetails,
  setLoadingDetails,
  setHasMore,
  setError,
  setEnrolledCourses,
  enrollInCourse,
  updateLessonCompletion,
  loadLessonCompletions,
} = courseSlice.actions;

export default courseSlice.reducer;
