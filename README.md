# KodeKloud Mobile LMS Mini App

![CI/CD Pipeline](https://github.com/ikhlaqkhan/KodeKloud/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green)

## 📱 Overview

A mobile Learning Management System (LMS) built with React Native that enables learners to browse courses, watch video lessons, and track their learning progress. This app demonstrates enterprise-level architecture patterns and best practices for a React Native App.

## 🎬 Demo

[ScreenShots](https://drive.google.com/drive/folders/1GiwYF6YL4y3wisBtLc92_e0C1lc6wXEU?usp=sharing)

### 📱 Full App Demo

[Full App Demo](https://drive.google.com/file/d/1yOPTjtDFLK6J3Ulbj56lObdXR__A1ISw/view?usp=sharing)

### 🔗 Deep Linking Demo

[Deep Linking Demo](https://drive.google.com/file/d/1MdKhPpwOWlAzRKOV-PGhKYh49hdriONI/view?usp=sharing)

### ✨ Key Features

- 📚 **Browse Courses** - Paginated course list with infinite scroll
- 🎥 **Video Playback** - Stream lessons with resume capability
- 📊 **Progress Tracking** - Track completion percentage per lesson and course
- 💾 **Data persistence** - Local enrollment and progress persistence
- 🏗️ **Clean Architecture** - Separation of concerns with domain/data/presentation layers
- 🎯 **Smart Resume** - Videos resume from last watched position

## 🛠️ Tech Stack

### Core Technologies

- **React Native 0.81.1** - Cross-platform mobile framework
- **TypeScript 5.8.3** - Type-safe development
- **Redux Toolkit** - Global state management
- **React Navigation v7** - Navigation and routing

### Architecture & Patterns

- **Clean Architecture** - Clear separation between UI, business logic, and data
- **Repository Pattern** - Abstraction of data sources
- **MVVM Pattern** - ViewModel pattern with Redux
- **Use Cases** - Encapsulated business logic

### Storage & Persistence

- **MMKV** - High-performance key-value storage for video progress
- **AsyncStorage** - Lightweight storage for enrollment data
- **Redux** - In-memory state management

### Development Tools

- **ESLint & Prettier** - Code quality and formatting
- **Jest** - Unit testing framework (parially implemented in other branch : `unit-tests`)
- **GitHub Actions** - CI/CD pipeline (created simple android app building workflow)
- **TypeScript** - Static type checking

## 🏗️ Project Architecture

```
src/
├── domain/                    # Business logic & entities
│   ├── Course.ts              # Course entity & types
│   ├── repositories/          # Repository interfaces
│   │   └── CourseRepositoryInterface.ts
│   └── usecases/              # Business operations
│       └── CourseUseCases.ts
├── data/                      # Data layer
│   ├── ApiClient.ts           # Network API client
│   └── repositories/          # Repository implementations
│       └── CourseRepository.ts
├── presentation/              # UI layer
│   ├── screens/               # App screens
│   │   ├── CourseListScreen/
│   │   ├── CourseDetailScreen/
│   │   └── VideoPlayerScreen/
│   ├── components/            # Reusable UI components
│   │   ├── CourseCard/
│   │   ├── ProgressBar/
│   │   ├── LoadingView/       # NEW: Reusable loading component
│   │   └── ErrorView/         # NEW: Reusable error component
│   ├── hooks/                 # NEW: Custom hooks (ViewModels)
│   │   ├── useCourseList.ts  # Course list business logic
│   │   └── useCourseDetail.ts # Course detail business logic
│   └── navigation/            # Navigation setup
│       ├── AppNavigator.tsx
│       ├── LinkingConfig.ts   # Deep linking configuration
│       └── types.ts           # Navigation types
├── context/                   # NEW: Dependency injection
│   └── DependencyContext.tsx  # DI container using Context API
├── services/                  # NEW: Cross-cutting services
│   └── StorageService.ts      # Centralized storage operations
├── store/                     # Redux state management
│   ├── courseSlice.ts         # Course state & actions
│   └── store.ts               # Store configuration
└── utils/                     # Helper functions
    └── helperFunctions.ts     # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- iOS: Xcode 15+ (Mac only)
- Android: Android Studio with SDK 34

### Installation

```bash
# Clone the repository
git clone https://github.com/ikhlaqkhan/KodeKloud.git
cd KodeKloud

# Install dependencies
npm install

# iOS only: Install pods
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Development Commands

```bash
# Run linter
npm run lint

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Build Android APK (Debug)
cd android && ./gradlew assembleDebug

# Build Android APK (Release)
cd android && ./gradlew assembleRelease
```

## 📡 API Integration

### Base URL

```
https://learn-api.kodekloud.com/api
```

### Endpoints

#### Get Courses (Paginated)

```http
GET /courses?page={page}

Response:
{
  "courses": [
    {
      "id": "c4f8aa40-d06e-4731-b6bd-4221632df06c",
      "slug": "crash-course-docker-for-absolute-beginner",
      "title": "Crash Course: Docker For Absolute Beginners",
      "thumbnail_url": "http://res.cloudinary.com/kodekloud/...",
      "difficulty_level": "beginner",
      "plan": "free",
      "tutors": [{"name": "Mumshad Mannambeth"}],
      "categories": [{"name": "DevOps"}]
    }
  ],
  "metadata": {
    "page": 1,
    "total_count": 159,
    "limit": 12,
    "next_page": 2
  }
}
```

#### Get Course Details

```http
GET /courses/{slug}

Response:
{
  "course": {
    "id": "uuid",
    "title": "Course Title",
    "description": "Detailed description",
    "course_duration": 7200,  // in seconds
    "plan": "free",
    "modules": [
      {
        "id": "module-1",
        "title": "Introduction",
        "lessons": [
          {
            "id": "lesson-1",
            "title": "Getting Started",
            "type": "video",
            "duration": 300,
            "video_url": "https://..."
          }
        ]
      }
    ]
  }
}
```

## 💾 Local Storage Schema

### MMKV Keys (High-Performance Storage)

```javascript
// Video playback position (in seconds)
`video_progress_${courseSlug}_${lessonId}` 

// Lesson completion percentage (0-100)
`lesson_completed_${courseSlug}_${lessonId}` 

// Overall course progress percentage
`course_progress_${courseSlug}`
```

### AsyncStorage Keys (Persistent Storage)

```javascript
// Array of enrolled course slugs
'@enrolled_courses' // string[]
```

### Redux State Structure

```typescript
{
  courses: {
    courses: Course[],
    courseDetails: { [slug: string]: CourseDetail },
    enrolledCourses: string[],
    lessonCompletions: { [key: string]: number },
    currentPage: number,
    hasMore: boolean,
    loading: boolean,
    error: string | null
  }
}
```

## 🧪 Testing

### Unit Tests (implemented in unit-tests branch only)

```bash
# Run all tests
npm test (runs on unit-tests branch only)

# Run specific test file
npm test CourseUseCases.test.ts (runs on unit-tests branch only)

```

## 📦 CI/CD Pipeline

GitHub Actions workflow runs on push to `develop`:

1. **Checkout** - Get latest code
2. **Setup** - Node.js and JDK configuration
3. **Install** - NPM dependencies
4. **Lint** - ESLint code quality checks
5. **Type Check** - TypeScript validation
6. **Test** - Jest unit tests
7. **Build** - Android APK generation
8. **Upload** - APK artifact for download

### GitHub Actions Workflow

```yaml
name: CI Pipeline
on:
  push:
    branches: [ build-test-branch ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node & Java
      - Install Dependencies
      - Lint & Test
      - Build APK
      - Upload Artifacts
```

## 🎯 Key Implementation Highlights

### Clean Architecture Benefits

- **Separation of Concerns**: UI, business logic, and data layers are independent
- **Testability**: Each layer can be tested in isolation (not implemented)
- **Scalability**: Easy to add new features without breaking existing code

### Performance Optimizations

- **Lazy Loading**: Courses load on-demand with pagination
- **Image Compatibility**: HTTPS conversion for iOS compatibility
- **Progress Caching**: MMKV for fast read/write operations
- **Optimized Re-renders**: Redux with proper memoization

### User Experience Features

- **Resume Playback**: Videos automatically resume from last position
- **Progress Indicators**: Visual feedback on course and lesson completion
- **Smooth Navigation**: Stack navigation with proper back handling

## 📈 Technical Decisions

### Why MMKV over AsyncStorage for Progress?

- **Performance**: 30x faster than AsyncStorage
- **Synchronous API**: No async/await needed for frequent updates
- **Perfect for**: Video position updates every 5 seconds

### Why Repository Pattern?

- **Abstraction**: UI doesn't know where data comes from
- **Flexibility**: Easy to switch between API/Local/Mock data
- **Testing**: Can mock repositories for unit tests

### Why Redux Toolkit?

- **Modern Redux**: Less boilerplate, better developer experience
- **Predictable**: Single source of truth for app state
