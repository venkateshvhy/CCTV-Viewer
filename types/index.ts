
export interface VideoError {
    errorString?: string;
    errorCode?: string;
    error?: string;
    domain?: string;
  }
  
  export interface OnVideoErrorData {
    error: VideoError;
    target?: number;
  }
  
  export interface CameraStream {
    id: string;
    url: string;
    name: string;
    status?: 'online' | 'offline';
  }

  export interface OnBufferData {
    isBuffering: boolean;
    target?: number;
  }

  