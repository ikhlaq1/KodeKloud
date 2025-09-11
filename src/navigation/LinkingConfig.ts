const linking = {
  prefixes: ['kodekloud://', 'https://kodekloud.com'],
  config: {
    screens: {
      CourseList: 'courses',
      CourseDetail: {
        path: 'courses/:courseSlug',
        parse: { courseSlug: (slug: string) => slug },
      },
      VideoPlayer: {
        path: 'courses/:courseSlug/lesson/:lessonId',
        parse: {
          courseSlug: (slug: string) => slug,
          lessonId: (id: string) => id,
        },
      },
    },
  },
};

export default linking;
