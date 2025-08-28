import React from 'react';
import { File, Download, Trash2, Play, Folder, HardDrive } from 'lucide-react';

interface FilesPopupProps {
  onClose: () => void;
}

export const FilesPopup: React.FC<FilesPopupProps> = ({ onClose }) => {
  const recordings = [
    { id: '1', name: 'Stream_2024-01-15.mp4', size: '850 MB', duration: '1:01:05' },
    { id: '2', name: 'Gameplay_2024-01-14.mp4', size: '520 MB', duration: '35:40' },
    { id: '3', name: 'Tutorial_2024-01-13.mp4', size: '1.2 GB', duration: '1:45:20' }
  ];

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-96">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Folder size={16} />
            <span>Nagrania</span>
          </h3>
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <HardDrive size={12} />
            <span>2.57 GB</span>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <File size={14} className="text-blue-400" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {recording.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {recording.size} • {recording.duration}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  className="p-1 text-gray-400 hover:text-green-400 rounded transition-colors"
                  title="Odtwórz"
                >
                  <Play size={12} />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-blue-400 rounded transition-colors"
                  title="Pobierz"
                >
                  <Download size={12} />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                  title="Usuń"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600">
          <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
            Otwórz folder nagrań
          </button>
        </div>
      </div>
    </div>
  );
};