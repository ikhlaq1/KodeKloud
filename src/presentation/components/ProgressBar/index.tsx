import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

const ProgressBar = ({
  progress,
  showPercentage = true,
  height = 4,
  backgroundColor = '#E0E0E0',
  fillColor = '#4CAF50',
}: ProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
      {showPercentage && <Text style={styles.progressText}>{progress}% Complete</Text>}
    </View>
  );
};

export default ProgressBar;
