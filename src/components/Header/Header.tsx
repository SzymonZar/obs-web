import React from 'react';
import { Play, Square, Radio, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { StreamStatus } from '../../types';

interface HeaderProps {
  streamStatus: StreamStatus;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onStartStreaming: () => void;
  onStopStreaming: () => void;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streamStatus,
  onStartRecording,
  onStopRecording,
  onStartStreaming,
  onStopStreaming,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">OBS Web Studio</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>FPS: {streamStatus.fps}</span>
            <span>•</span>
            <span>Bitrate: {streamStatus.bitrate} kb/s</span>
            {streamStatus.droppedFrames > 0 && (
              <>
                <span>•</span>
                <span className="text-red-400">Dropped: {streamStatus.droppedFrames}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Recording Controls */}
          <div className="flex items-center space-x-2">
            {streamStatus.isRecording ? (
              <>
                <button
                  onClick={onStopRecording}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Square size={16} />
                  <span>Stop Recording</span>
                </button>
                <div className="text-red-400 font-mono">
                  {formatTime(streamStatus.recordingTime)}
                </div>
              </>
            ) : (
              <button
                onClick={onStartRecording}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span>Start Recording</span>
              </button>
            )}
          </div>

          {/* Streaming Controls */}
          <div className="flex items-center space-x-2">
            {streamStatus.isStreaming ? (
              <>
                <button
                  onClick={onStopStreaming}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Square size={16} />
                  <span>Stop Stream</span>
                </button>
                <div className="text-blue-400 font-mono">
                  {formatTime(streamStatus.streamingTime)}
                </div>
              </>
            ) : (
              <button
                onClick={onStartStreaming}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Radio size={16} />
                <span>Go Live</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};