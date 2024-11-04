import React from 'react';
import CCTVViewer from './components/CCTVViewer';
import { CameraStream } from './types';

const App = () => {
  const cameraStreams = [
    {
      id: '1',
      url: 'rtsp://rtspstream:d33691053e9c05906abfc71ef56b670f@zephyr.rtsp.stream/movie', // 'https://www.w3schools.com/html/mov_bbb.mp4', // https://www.w3schools.com/html/mov_bbb.mp4  
      name: 'Camera 1',
      status: 'online'
    },
    {
      id: '2',
      url: 'rtsp://rtspstream:3aaf6fa57e32f1e132c8957e8346a391@zephyr.rtsp.stream/pattern', // 'https://www.w3schools.com/html/mov_bbb.mp4',
      name: 'Camera 2',
      status: 'online'
    },
    {
      id: '3',
      url: 'rtsp://rtspstream:3aaf6fa57e32f1e132c8957e8346a391@zephyr.rtsp.stream/pattern', // 'https://www.w3schools.com/html/mov_bbb.mp4',
      name: 'Camera 3',
      status: 'online'
    },
    {
      id: '4',
      url: 'rtsp://rtspstream:d33691053e9c05906abfc71ef56b670f@zephyr.rtsp.stream/movie',
      name: 'Camera 4',
      status: 'online'
    }
  ] as CameraStream[];

  return <CCTVViewer streams={cameraStreams} />;
};

export default App;