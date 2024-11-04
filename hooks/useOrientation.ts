import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

export const useOrientation = (isFullscreen: boolean) => {
  useEffect(() => {
    if (isFullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    return () => {
      Orientation.lockToPortrait();
    };
  }, [isFullscreen]);
};