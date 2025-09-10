import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progress: {
    color: '#fff',
    fontSize: 14,
  },
});

export default styles;
