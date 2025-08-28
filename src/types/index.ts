export interface Scene {
  id: string;
  name: string;
  isActive: boolean;
  sources: Source[];
  preview?: string;
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  visible: boolean;
  locked: boolean;
  volume: number;
  muted: boolean;
  properties: Record<string, any>;
}

export enum SourceType {
  VideoCapture = 'video_capture',
  AudioCapture = 'audio_input',
  DisplayCapture = 'display_capture',
  WindowCapture = 'window_capture',
  ImageSource = 'image_source',
  TextSource = 'text_gdiplus',
  MediaSource = 'ffmpeg_source',
  BrowserSource = 'browser_source'
}

export interface StreamStatus {
  isRecording: boolean;
  isStreaming: boolean;
  recordingTime: number;
  streamingTime: number;
  bitrate: number;
  droppedFrames: number;
  fps: number;
}

export interface AudioDevice {
  id: string;
  name: string;
  type: 'input' | 'output';
  isDefault: boolean;
  monitoring: 'none' | 'monitor' | 'monitor_and_output';
}

export interface Recording {
  id: string;
  filename: string;
  duration: number;
  size: number;
  date: Date;
  format: string;
}

export interface AudioTrack {
  id: number;
  name: string;
  enabled: boolean;
  sources: string[];
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  enabled: boolean;
  script: string;
  permissions: string[];
}

export interface TTSSettings {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface DockPanel {
  id: string;
  name: string;
  visible: boolean;
  position: 'left' | 'right' | 'bottom' | 'floating';
  size: { width: number; height: number };
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
}