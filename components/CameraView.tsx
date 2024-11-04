import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { VLCPlayer } from 'react-native-vlc-media-player';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface CameraViewProps {
  camera: {
    url: string;
    name: string;
  };
  isFullscreen?: boolean;
  onPress?: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  camera,
  isFullscreen = false,
  onPress,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const playerRef = useRef(null);
  const lastProgressRef = useRef(Date.now());
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const clearAllTimers = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
  }, []);

  const resetPlayer = useCallback(() => {
    if (playerRef.current) {
      // Force player to recreate by temporarily setting source to null
      const player = playerRef.current as any;
      player.seek(0);
      setPaused(true);
      setTimeout(() => {
        setPaused(false);
      }, 500);
    }
  }, []);

  useEffect(() => {
    // Reset state when camera changes
    setIsLoading(true);
    setError(null);
    setPaused(false);
    retryCountRef.current = 0;
    lastProgressRef.current = Date.now();
    clearAllTimers();

    // Set up loading timeout
    loadingTimerRef.current = setTimeout(() => {
      if (isLoading) {
        setError(`Timeout loading camera ${camera.name}`);
        setIsLoading(false);
      }
    }, 10000); // Reduced timeout to 10 seconds

    return clearAllTimers;
  }, [camera.url, camera.name, clearAllTimers]);

  const handleError = useCallback((error: any) => {
    console.error("Camera Error:", JSON.stringify(error));
    clearAllTimers();
    
    // Attempt automatic retry if within retry limit
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current++;
      console.log(`Attempting automatic retry ${retryCountRef.current}/${maxRetries}`);
      resetPlayer();
      setIsLoading(true);
      setError(null);
      
      // Set up new loading timeout
      loadingTimerRef.current = setTimeout(() => {
        if (isLoading) {
          setError(`Retry ${retryCountRef.current} failed for camera ${camera.name}`);
          setIsLoading(false);
        }
      }, 10000);
    } else {
      setError(`Failed to connect to camera ${camera.name} after ${maxRetries} attempts. ${error?.message || "Unknown error"}`);
      setIsLoading(false);
      setPaused(true);
    }
  }, [camera.name, isLoading, resetPlayer, clearAllTimers]);

  const handleProgress = useCallback((progress: any) => {
    lastProgressRef.current = Date.now();
    
    if (isLoading) {
      setIsLoading(false);
      clearAllTimers();
      // Reset retry count on successful connection
      retryCountRef.current = 0;
    }

    if (error) {
      setError(null);
    }

    // Set up connection check
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    checkTimeoutRef.current = setTimeout(() => {
      const timeSinceLastProgress = Date.now() - lastProgressRef.current;
      if (timeSinceLastProgress > 5000) {
        handleError({ message: "Connection timeout - no frames received" });
      }
    }, 5000);
  }, [error, isLoading, handleError, clearAllTimers]);

  const handleRetry = useCallback(() => {
    retryCountRef.current = 0;
    clearAllTimers();
    resetPlayer();
    setError(null);
    setIsLoading(true);
    setPaused(false);
    lastProgressRef.current = Date.now();

    loadingTimerRef.current = setTimeout(() => {
      if (isLoading) {
        setError(`Timeout loading camera ${camera.name}`);
        setIsLoading(false);
      }
    }, 10000);
  }, [camera.name, isLoading, resetPlayer, clearAllTimers]);

  const containerStyle = [
    styles.container,
    isFullscreen && styles.fullscreen,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isFullscreen || !!error}
    >
      <VLCPlayer
        ref={playerRef}
        style={styles.video}
        videoAspectRatio="16:9"
        paused={paused}
        source={{
          uri: camera.url,
          initOptions: [
            '--no-drop-late-frames',
            '--no-skip-frames',
            '--rtsp-tcp',
            '--network-caching=100',  // Reduced from 150
            '--rtsp-caching=100',     // Reduced from 150
            '--rtsp-frame-buffer-size=500000',
            '--live-caching=100',     // Reduced from 150
            '--rtsp-timeout=5',
            '--rtsp-connection-timeout=5',
            '--clock-jitter=0',       // Added to reduce jitter
            '--clock-synchro=0',      // Added to reduce synchronization issues
          ],
        }}
        onError={handleError}
        onProgress={handleProgress}
      />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 4,
  },
  fullscreen: {
    margin: 0,
    borderRadius: 0,
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});