declare module 'react-native-vlc-media-player' {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';
  
    interface VLCPlayerProps extends ViewProps {
      source: {
        uri: string;
        initOptions?: string[];
      };
      paused?: boolean;
      seek?: number;
      videoAspectRatio?: string;
      onProgress?: (progress: { time: number; position: number; duration: number }) => void;
      onError?: (error: any) => void;
      // Add other props as needed
    }
  
    export class VLCPlayer extends Component<VLCPlayerProps> {
      seek(time: number): void;
      snapshot(): void;
      resume(): void;
      pause(): void;
    }
  }