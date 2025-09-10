import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, CourseDetail } from '../domain/Course';

interface CourseState {
  courses: Course[];
  courseDetails: { [slug: string]: CourseDetail };
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadingDetails: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  courseDetails: {},
  currentPage: 1,
  hasMore: true,
  loading: false,
  loadingMore: false,
  loadingDetails: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.loadingMore = action.payload;
    },
    setLoadingDetails: (state, action: PayloadAction<boolean>) => {
      state.loadingDetails = action.payload;
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      console.log('🚀 ~ action:', action);
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCourseDetails: (state, action: PayloadAction<{ slug: string; details: CourseDetail }>) => {
      state.courseDetails[action.payload.slug] = action.payload.details;
      state.loadingDetails = false;
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
} = courseSlice.actions;

export default courseSlice.reducer;
