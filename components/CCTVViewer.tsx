import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CameraStream } from '../types';
import { CameraView } from './CameraView';
import { useOrientation } from '../hooks/useOrientation';

interface CCTVViewerProps {
  streams: CameraStream[];
}

const CCTVViewer: React.FC<CCTVViewerProps> = ({ streams }) => {
  const [fullscreenCamera, setFullscreenCamera] = useState<CameraStream | null>(null);
  const isFullscreen = !!fullscreenCamera;
  
  useOrientation(isFullscreen);

  const handleCameraPress = useCallback((camera: CameraStream) => {
    setFullscreenCamera(camera);
  }, []);

  const exitFullscreen = useCallback(() => {
    setFullscreenCamera(null);
  }, []);

  if (isFullscreen) {
    return (
      <SafeAreaView style={styles.fullscreenContainer}>
        <CameraView camera={fullscreenCamera} isFullscreen />
        <TouchableOpacity
          style={styles.exitButton}
          onPress={exitFullscreen}
        >
          <MaterialIcons name="cancel" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridContainer}>
        {streams.map(camera => (
          <View key={camera.id} style={styles.cameraWrapper}>
            <CameraView
              camera={camera}
              onPress={() => handleCameraPress(camera)}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  cameraWrapper: {
    width: width / 2 - 8,
    height: height / 2 - 8,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  exitButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
});

export default CCTVViewer;