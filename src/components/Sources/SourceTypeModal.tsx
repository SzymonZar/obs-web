import React from 'react';
import { X, Monitor, Camera, Mic, Image, Type, Film, Globe, Airplay as Display, AppWindow as Window } from 'lucide-react';
import { SourceType } from '../../types';

interface SourceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: SourceType, name: string) => void;
}

export const SourceTypeModal: React.FC<SourceTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType
}) => {
  const [selectedType, setSelectedType] = React.useState<SourceType | null>(null);
  const [sourceName, setSourceName] = React.useState('');

  const sourceTypes = [
    {
      type: SourceType.VideoCapture,
      name: 'Video Capture Device',
      description: 'Webcam, USB camera, or capture card',
      icon: Camera,
      color: 'bg-blue-600'
    },
    {
      type: SourceType.DisplayCapture,
      name: 'Display Capture',
      description: 'Capture entire screen or display',
      icon: Monitor,
      color: 'bg-green-600'
    },
    {
      type: SourceType.WindowCapture,
      name: 'Window Capture',
      description: 'Capture specific application window',
      icon: Window,
      color: 'bg-purple-600'
    },
    {
      type: SourceType.AudioCapture,
      name: 'Audio Input Capture',
      description: 'Microphone or audio input device',
      icon: Mic,
      color: 'bg-red-600'
    },
    {
      type: SourceType.ImageSource,
      name: 'Image',
      description: 'Static image file (PNG, JPG, etc.)',
      icon: Image,
      color: 'bg-yellow-600'
    },
    {
      type: SourceType.TextSource,
      name: 'Text (GDI+)',
      description: 'Dynamic text overlay',
      icon: Type,
      color: 'bg-indigo-600'
    },
    {
      type: SourceType.MediaSource,
      name: 'Media Source',
      description: 'Video or audio file playback',
      icon: Film,
      color: 'bg-pink-600'
    },
    {
      type: SourceType.BrowserSource,
      name: 'Browser Source',
      description: 'Web page or HTML content',
      icon: Globe,
      color: 'bg-cyan-600'
    }
  ];

  const handleTypeSelect = (type: SourceType, defaultName: string) => {
    setSelectedType(type);
    setSourceName(defaultName);
  };

  const handleCreate = () => {
    if (selectedType && sourceName.trim()) {
      onSelectType(selectedType, sourceName.trim());
      onClose();
      setSelectedType(null);
      setSourceName('');
    }
  };

  const handleCancel = () => {
    onClose();
    setSelectedType(null);
    setSourceName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add Source</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!selectedType ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sourceTypes.map((source) => {
                const Icon = source.icon;
                return (
                  <button
                    key={source.type}
                    onClick={() => handleTypeSelect(source.type, source.name)}
                    className="flex items-start space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className={`p-2 ${source.color} rounded-lg`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium">{source.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{source.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Name
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter source name"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedType(null)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!sourceName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};