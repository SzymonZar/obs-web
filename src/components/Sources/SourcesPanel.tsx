import React from 'react';
import { Plus, Eye, EyeOff, Volume2, VolumeX, Lock, Unlock, Trash2, Settings, GripVertical } from 'lucide-react';
import { Source, SourceType } from '../../types';
import { SourceTypeModal } from './SourceTypeModal';

interface SourcesPanelProps {
  sources: Source[];
  onSourceAdd: (type: SourceType, name: string) => void;
  onSourceDelete: (sourceId: string) => void;
  onSourceToggleVisibility: (sourceId: string) => void;
  onSourceToggleMute: (sourceId: string) => void;
  onSourceToggleLock: (sourceId: string) => void;
  onSourceVolumeChange: (sourceId: string, volume: number) => void;
  onSourceSettings: (sourceId: string) => void;
  onSourceReorder: (sourceId: string, direction: 'up' | 'down') => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  sources,
  onSourceAdd,
  onSourceDelete,
  onSourceToggleVisibility,
  onSourceToggleMute,
  onSourceToggleLock,
  onSourceVolumeChange,
  onSourceSettings,
  onSourceReorder
}) => {
  const [isSourceModalOpen, setIsSourceModalOpen] = React.useState(false);

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case SourceType.VideoCapture:
        return '📹';
      case SourceType.AudioCapture:
        return '🎤';
      case SourceType.DisplayCapture:
        return '🖥️';
      case SourceType.WindowCapture:
        return '🪟';
      case SourceType.ImageSource:
        return '🖼️';
      case SourceType.TextSource:
        return '📝';
      case SourceType.MediaSource:
        return '🎬';
      case SourceType.BrowserSource:
        return '🌐';
      default:
        return '📄';
    }
  };

  const handleSourceAdd = (type: SourceType, name: string) => {
    onSourceAdd(type, name);
    setIsSourceModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-800 border-r border-gray-700 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Sources</h3>
          <button
            onClick={() => setIsSourceModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Add Source"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p className="text-sm">No sources added</p>
            <button
              onClick={() => setIsSourceModalOpen(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Add your first source
            </button>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sources.map((source, index) => (
              <div
                key={source.id}
                className={`group flex items-center p-2 rounded-lg transition-all ${
                  source.visible 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-800 hover:bg-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <button
                    className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
                    title="Reorder"
                  >
                    <GripVertical size={14} />
                  </button>
                  
                  <span className="text-lg">{getSourceIcon(source.type)}</span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {source.name}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {source.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {/* Audio Volume Control */}
                  {(source.type === SourceType.AudioCapture || source.type === SourceType.MediaSource) && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onSourceToggleMute(source.id)}
                        className={`p-1 rounded transition-colors ${
                          source.muted 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        title={source.muted ? 'Unmute' : 'Mute'}
                      >
                        {source.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={source.volume}
                        onChange={(e) => onSourceVolumeChange(source.id, parseInt(e.target.value))}
                        className="w-16 h-1 bg-gray-600 rounded-lg appearance-none slider"
                        disabled={source.muted}
                      />
                    </div>
                  )}

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onSourceToggleVisibility(source.id)}
                    className={`p-1 rounded transition-colors ${
                      source.visible 
                        ? 'text-green-400 hover:text-green-300' 
                        : 'text-gray-500 hover:text-gray-400'
                    }`}
                    title={source.visible ? 'Hide' : 'Show'}
                  >
                    {source.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    onClick={() => onSourceToggleLock(source.id)}
                    className={`p-1 rounded transition-colors ${
                      source.locked 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : 'text-gray-500 hover:text-gray-400'
                    }`}
                    title={source.locked ? 'Unlock' : 'Lock'}
                  >
                    {source.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => onSourceSettings(source.id)}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Settings"
                  >
                    <Settings size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onSourceDelete(source.id)}
                    className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
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

      <SourceTypeModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onSelectType={handleSourceAdd}
      />
    </>
  );
};