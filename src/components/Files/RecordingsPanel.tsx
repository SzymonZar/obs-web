import React from 'react';
import { Download, Play, Trash2, Folder, File, Clock, HardDrive } from 'lucide-react';
import { Recording } from '../../types';

interface RecordingsPanelProps {
  recordings: Recording[];
  onDownload: (recordingId: string) => void;
  onDelete: (recordingId: string) => void;
  onPlay: (recordingId: string) => void;
}

export const RecordingsPanel: React.FC<RecordingsPanelProps> = ({
  recordings,
  onDownload,
  onDelete,
  onPlay
}) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSize = recordings.reduce((sum, rec) => sum + rec.size, 0);

  return (
    <div className="bg-gray-800 border-t border-gray-700 h-64 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Folder size={16} className="text-gray-400" />
          <h3 className="text-white font-semibold">Recordings</h3>
          <span className="text-gray-400 text-sm">({recordings.length})</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <HardDrive size={14} />
          <span>{formatFileSize(totalSize)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {recordings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <File size={32} className="mb-2" />
            <p className="text-sm">No recordings yet</p>
            <p className="text-xs">Start recording to see files here</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="group flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-blue-400">
                    <File size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {recording.filename}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{formatDuration(recording.duration)}</span>
                      </span>
                      <span>{formatFileSize(recording.size)}</span>
                      <span>{recording.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onPlay(recording.id)}
                    className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded transition-colors"
                    title="Play"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={() => onDownload(recording.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(recording.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};