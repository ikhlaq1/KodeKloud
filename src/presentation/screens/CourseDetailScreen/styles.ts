import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  thumbnail: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  enrollButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lessonsSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  comingSoon: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  descriptionSection: {
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F4FD',
    color: '#0066CC',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  noLessons: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  planBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  planText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modulesSection: {
    marginTop: 30,
  },
  module: {
    marginBottom: 20,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 6,
  },
  lessonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lessonType: {
    fontSize: 11,
    color: '#0066CC',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  enrolledBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  enrolledText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  enrolledButton: {
    backgroundColor: '#4CAF50', // Green when enrolled
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  progressSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedLesson: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  completedLabel: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default styles;
