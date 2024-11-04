import Video from 'react-native-video';

// Define the selected track type explicitly
type SelectedTrackType = 'auto' | 'disabled' | 'resolution' | 'language' | 'title';

// Define the video track configuration
interface SelectedVideoTrackConfig {
  type: SelectedTrackType;
  value: number | string;
}

// Define the buffer configuration
interface BufferConfig {
  minBufferMs: number;
  maxBufferMs: number;
  bufferForPlaybackMs: number;
  bufferForPlaybackAfterRebufferMs: number;
}

// Define the video configuration
interface VideoConfig {
  bufferConfig: BufferConfig;
  maxBitRate: number;
  selectedVideoTrack: SelectedVideoTrackConfig;
}

// Export the default configuration
export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  bufferConfig: {
    minBufferMs: 500,
    maxBufferMs: 1000,
    bufferForPlaybackMs: 500,
    bufferForPlaybackAfterRebufferMs: 1000
  },
  maxBitRate: 2000000,
  selectedVideoTrack: {
    type: 'auto',
    value: 480
  }
};